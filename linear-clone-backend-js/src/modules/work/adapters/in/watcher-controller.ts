import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  AddWatcherRequestSchema,
  WatcherIdParamsSchema,
} from './dto';
import { AddWatcher } from '../../application/add-watcher';
import { RemoveWatcher } from '../../application/remove-watcher';
import { ListWatchers } from '../../application/list-watchers';
import { DrizzleWatcherRepository } from '../out/drizzle-watcher-repository';
import { WorkToGatewayBridge } from '../../../gateway/adapters/out/work-to-gateway-bridge';
import { sharedEventEmitter } from '../../../../shared/events/shared-event-emitter';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../../identity/domain/team-member';
import { issues } from '../../domain/issue';
import { eq, and, isNull } from 'drizzle-orm';
import {
  AlreadyWatchingError,
  WatcherNotFoundError,
} from '../../domain/errors';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';

const watcherRepository = new DrizzleWatcherRepository();
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

const addWatcher = new AddWatcher(watcherRepository, teamMemberQuery, issueTeamQuery, eventPublisher);
const removeWatcher = new RemoveWatcher(watcherRepository, eventPublisher);
const listWatchers = new ListWatchers(watcherRepository);

async function getUserIdFromToken(request: FastifyRequest): Promise<string | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);
  if (!tokenResult.valid || !tokenResult.userId) return null;
  return tokenResult.userId;
}

function serializeWatcher(watcher: any): Record<string, unknown> {
  return {
    id: watcher.id,
    issueId: watcher.issueId,
    userId: watcher.userId,
    createdAt: watcher.createdAt instanceof Date ? watcher.createdAt.toISOString() : watcher.createdAt,
  };
}

export async function watcherRoutes(app: FastifyInstance) {
  // GET /issues/:id/watchers — List watchers
  app.get(
    '/issues/:id/watchers',
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
        const result = await listWatchers.execute(params.id);
        return reply.status(200).send({ data: result.map(serializeWatcher) });
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

  // POST /issues/:id/watchers — Add watcher
  app.post(
    '/issues/:id/watchers',
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
        const body = AddWatcherRequestSchema.parse(request.body);
        const watcher = await addWatcher.execute({ issueId: params.id, userId: body.userId }, userId);
        return reply.status(201).send({ data: serializeWatcher(watcher) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof AlreadyWatchingError) {
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

  // DELETE /issues/:id/watchers/:userId — Remove watcher
  app.delete(
    '/issues/:id/watchers/:userId',
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

        const params = WatcherIdParamsSchema.parse(request.params);
        await removeWatcher.execute({ issueId: params.id, userId: params.userId }, userId);
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues },
          });
        }
        if (error instanceof WatcherNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        throw error;
      }
    },
  );
}
