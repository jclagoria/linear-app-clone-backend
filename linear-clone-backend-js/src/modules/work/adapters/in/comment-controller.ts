import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  CreateCommentRequestSchema,
  UpdateCommentRequestSchema,
  CommentIdParamsSchema,
} from './dto';
import { CreateComment } from '../../application/create-comment';
import { UpdateComment } from '../../application/update-comment';
import { DeleteComment } from '../../application/delete-comment';
import { ListIssueComments } from '../../application/list-issue-comments';
import { DrizzleCommentRepository } from '../out/drizzle-comment-repository';
import { WorkToGatewayBridge } from '../../../gateway/adapters/out/work-to-gateway-bridge';
import { sharedEventEmitter } from '../../../../shared/events/shared-event-emitter';
import { DrizzleIssueRepository } from '../out/drizzle-issue-repository';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../../identity/domain/team-member';
import { issues } from '../../domain/issue';
import { eq, and, isNull } from 'drizzle-orm';
import {
  CommentNotFoundError,
  CommentNotOwnedByUserError,
  EmptyBodyError,
} from '../../domain/errors';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';

const commentRepository = new DrizzleCommentRepository();
const issueRepository = new DrizzleIssueRepository();
const eventPublisher = new WorkToGatewayBridge(sharedEventEmitter);
const tokenService = new JoseTokenService();

const teamMemberQuery = {
  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId), isNull(teamMembers.deletedAt)))
      .limit(1);
    return result.length > 0;
  },
};

const issueTeamQuery = {
  async getIssueTeamId(issueId: string): Promise<string | null> {
    const result = await db
      .select({ teamId: issues.teamId })
      .from(issues)
      .where(eq(issues.id, issueId))
      .limit(1);
    return result[0]?.teamId || null;
  },
};

const createComment = new CreateComment(commentRepository, teamMemberQuery, issueTeamQuery, eventPublisher);
const updateComment = new UpdateComment(commentRepository, eventPublisher);
const deleteComment = new DeleteComment(commentRepository, eventPublisher);
const listIssueComments = new ListIssueComments(commentRepository);

async function getUserIdFromToken(request: FastifyRequest): Promise<string | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);
  if (!tokenResult.valid || !tokenResult.userId) return null;
  return tokenResult.userId;
}

function serializeComment(comment: any): Record<string, unknown> {
  return {
    id: comment.id,
    issueId: comment.issueId,
    userId: comment.userId,
    body: comment.body,
    createdAt: comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt,
    updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt.toISOString() : comment.updatedAt,
    deletedAt: comment.deletedAt instanceof Date ? comment.deletedAt.toISOString() : comment.deletedAt,
  };
}

export async function commentRoutes(app: FastifyInstance) {
  // GET /issues/:id/comments — List comments
  app.get(
    '/issues/:id/comments',
    {
      config: {
        rateLimit: { max: 120, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const params = request.params as { id: string };
        const comments = await listIssueComments.execute(params.id);
        return reply.status(200).send({ data: comments.map(serializeComment) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        throw error;
      }
    },
  );

  // POST /issues/:id/comments — Create comment
  app.post(
    '/issues/:id/comments',
    {
      config: {
        rateLimit: { max: 60, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const params = request.params as { id: string };
        const body = CreateCommentRequestSchema.parse(request.body);
        const comment = await createComment.execute({ issueId: params.id, body: body.body }, userId);
        return reply.status(201).send({ data: serializeComment(comment) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof EmptyBodyError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: error.message } });
        }
        if (error instanceof Error && error.message === 'Issue not found') {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof Error && error.message === 'User is not a member of this team') {
          return reply.status(422).send({ error: { code: 'BUSINESS_RULE_ERROR', message: error.message } });
        }
        throw error;
      }
    },
  );

  // PATCH /issues/:id/comments/:commentId — Update comment
  app.patch(
    '/issues/:id/comments/:commentId',
    {
      config: {
        rateLimit: { max: 60, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const params = CommentIdParamsSchema.parse(request.params);
        const body = UpdateCommentRequestSchema.parse(request.body);
        const updated = await updateComment.execute(params.commentId, body, userId);
        return reply.status(200).send({ data: serializeComment(updated) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof CommentNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof CommentNotOwnedByUserError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        if (error instanceof EmptyBodyError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: error.message } });
        }
        throw error;
      }
    },
  );

  // DELETE /issues/:id/comments/:commentId — Delete comment
  app.delete(
    '/issues/:id/comments/:commentId',
    {
      config: {
        rateLimit: { max: 30, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const params = CommentIdParamsSchema.parse(request.params);
        await deleteComment.execute(params.commentId, userId);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof CommentNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof CommentNotOwnedByUserError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );
}
