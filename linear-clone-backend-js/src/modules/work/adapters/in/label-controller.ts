import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  CreateLabelRequestSchema,
  UpdateLabelRequestSchema,
  LabelIdParamsSchema,
  IssueLabelParamsSchema,
} from './dto';
import { CreateLabel } from '../../application/create-label';
import { UpdateLabel } from '../../application/update-label';
import { DeleteLabel } from '../../application/delete-label';
import { ListLabels } from '../../application/list-labels';
import { AttachLabel } from '../../application/attach-label';
import { DetachLabel } from '../../application/detach-label';
import { GetIssueLabels } from '../../application/get-issue-labels';
import { DrizzleLabelRepository } from '../out/drizzle-label-repository';
import { WorkToGatewayBridge } from '../../../gateway/adapters/out/work-to-gateway-bridge';
import { sharedEventEmitter } from '../../../../shared/events/shared-event-emitter';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../../identity/domain/team-member';
import { issues } from '../../domain/issue';
import { eq, and, isNull } from 'drizzle-orm';
import {
  LabelNotFoundError,
  LabelNameConflictError,
  LabelAlreadyAttachedError,
} from '../../domain/errors';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';

const labelRepository = new DrizzleLabelRepository();
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

const createLabel = new CreateLabel(labelRepository, eventPublisher);
const updateLabel = new UpdateLabel(labelRepository, eventPublisher);
const deleteLabel = new DeleteLabel(labelRepository, eventPublisher);
const listLabels = new ListLabels(labelRepository);
const attachLabel = new AttachLabel(labelRepository, teamMemberQuery, issueTeamQuery, eventPublisher);
const detachLabel = new DetachLabel(labelRepository, eventPublisher);
const getIssueLabels = new GetIssueLabels(labelRepository);

async function getUserIdFromToken(request: FastifyRequest): Promise<string | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);
  if (!tokenResult.valid || !tokenResult.userId) return null;
  return tokenResult.userId;
}

function serializeLabel(label: any): Record<string, unknown> {
  return {
    id: label.id,
    name: label.name,
    description: label.description || null,
    color: label.color || null,
    createdAt: label.createdAt instanceof Date ? label.createdAt.toISOString() : label.createdAt,
    updatedAt: label.updatedAt instanceof Date ? label.updatedAt.toISOString() : label.updatedAt,
    deletedAt: label.deletedAt instanceof Date ? label.deletedAt.toISOString() : label.deletedAt,
  };
}

export async function labelRoutes(app: FastifyInstance) {
  // GET /labels — List labels
  app.get(
    '/labels',
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

        const result = await listLabels.execute();
        return reply.status(200).send({ data: result.map(serializeLabel) });
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

  // POST /labels — Create label
  app.post(
    '/labels',
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

        const body = CreateLabelRequestSchema.parse(request.body);
        const label = await createLabel.execute(body, userId);
        return reply.status(201).send({ data: serializeLabel(label) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof LabelNameConflictError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        throw error;
      }
    },
  );

  // PATCH /labels/:id — Update label
  app.patch(
    '/labels/:id',
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

        const params = LabelIdParamsSchema.parse(request.params);
        const body = UpdateLabelRequestSchema.parse(request.body);
        const label = await updateLabel.execute(params.id, body, userId);
        return reply.status(200).send({ data: serializeLabel(label) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof LabelNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof LabelNameConflictError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        throw error;
      }
    },
  );

  // DELETE /labels/:id — Delete label
  app.delete(
    '/labels/:id',
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

        const params = LabelIdParamsSchema.parse(request.params);
        await deleteLabel.execute(params.id, userId);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof LabelNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        throw error;
      }
    },
  );

  // GET /issues/:id/labels — Get issue labels
  app.get(
    '/issues/:id/labels',
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
        const result = await getIssueLabels.execute(params.id);
        return reply.status(200).send({ data: result.map(serializeLabel) });
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

  // POST /issues/:id/labels — Attach label
  app.post(
    '/issues/:id/labels',
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
        const body = request.body as { labelId: string };
        const result = await attachLabel.execute({ issueId: params.id, labelId: body.labelId }, userId);
        return reply.status(201).send({ data: result });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof LabelNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof LabelAlreadyAttachedError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
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

  // DELETE /issues/:id/labels/:labelId — Detach label
  app.delete(
    '/issues/:id/labels/:labelId',
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

        const params = IssueLabelParamsSchema.parse(request.params);
        await detachLabel.execute({ issueId: params.id, labelId: params.labelId }, userId);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof LabelNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        throw error;
      }
    },
  );
}
