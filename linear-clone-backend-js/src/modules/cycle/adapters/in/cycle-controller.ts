import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { DrizzleCycleRepository } from '../out/drizzle-cycle-repository';
import { InMemoryCycleEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';
import { db } from '../../../../shared/database';
import { eq, and, isNull } from 'drizzle-orm';
import { teamMembers } from '../../../identity/domain/team-member';
import {
  CreateCycleRequestSchema,
  UpdateCycleRequestSchema,
  ListCyclesQuerySchema,
  CycleIdParamsSchema,
  TeamIdParamsSchema,
  CycleResponse,
  PaginatedCyclesResponse,
} from './dto';
import { CreateCycle } from '../../application/create-cycle';
import { UpdateCycle } from '../../application/update-cycle';
import { GetCycle } from '../../application/get-cycle';
import { ListCycles } from '../../application/list-cycles';
import { ActivateCycle } from '../../application/activate-cycle';
import { CompleteCycle } from '../../application/complete-cycle';
import { DeleteCycle } from '../../application/delete-cycle';
import {
  CycleNotFoundError,
  EmptyCycleNameError,
  NotCycleTeamMemberError,
  CycleDateValidationError,
  CyclePastStartDateError,
  InvalidCycleStatusTransitionError,
  DraftCycleCannotBeCompletedError,
  CompletedCycleCannotBeActivatedError,
  ActiveCycleCannotBeDeletedError,
  CycleNotActiveForIssueAssignmentError,
} from '../../domain/errors';

const cycleRepository = new DrizzleCycleRepository();
const eventPublisher = new InMemoryCycleEventPublisher();
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

const createCycle = new CreateCycle(cycleRepository, teamMemberQuery, eventPublisher);
const updateCycle = new UpdateCycle(cycleRepository, teamMemberQuery, eventPublisher);
const getCycle = new GetCycle(cycleRepository, teamMemberQuery);
const listCycles = new ListCycles(cycleRepository, teamMemberQuery);
const activateCycle = new ActivateCycle(cycleRepository, teamMemberQuery, eventPublisher);
const completeCycle = new CompleteCycle(cycleRepository, teamMemberQuery, eventPublisher);
const deleteCycle = new DeleteCycle(cycleRepository, teamMemberQuery);

async function getUserIdFromToken(request: FastifyRequest): Promise<string | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);
  if (!tokenResult.valid || !tokenResult.userId) {
    return null;
  }
  return tokenResult.userId;
}

function serializeCycle(cycle: any): CycleResponse {
  return {
    id: cycle.id,
    teamId: cycle.teamId,
    name: cycle.name,
    description: cycle.description,
    status: cycle.status,
    startDate: cycle.startDate instanceof Date ? cycle.startDate.toISOString().split('T')[0] : cycle.startDate,
    endDate: cycle.endDate instanceof Date ? cycle.endDate.toISOString().split('T')[0] : cycle.endDate,
    createdAt: cycle.createdAt instanceof Date ? cycle.createdAt.toISOString() : cycle.createdAt,
    updatedAt: cycle.updatedAt instanceof Date ? cycle.updatedAt.toISOString() : cycle.updatedAt,
    completedAt: cycle.completedAt instanceof Date ? cycle.completedAt.toISOString() : (cycle.completedAt || null),
  };
}

function handleControllerError(error: unknown, reply: FastifyReply) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    });
  }

  if (error instanceof CycleNotFoundError) {
    return reply.status(404).send({
      error: { code: 'NOT_FOUND', message: error.message },
    });
  }

  if (error instanceof EmptyCycleNameError) {
    return reply.status(400).send({
      error: { code: 'VALIDATION_ERROR', message: error.message },
    });
  }

  if (error instanceof NotCycleTeamMemberError) {
    return reply.status(403).send({
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }

  if (error instanceof CycleDateValidationError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof CyclePastStartDateError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof InvalidCycleStatusTransitionError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof DraftCycleCannotBeCompletedError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof CompletedCycleCannotBeActivatedError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof ActiveCycleCannotBeDeletedError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof CycleNotActiveForIssueAssignmentError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  throw error;
}

export async function cycleRoutes(app: FastifyInstance) {
  // POST /cycles - Create cycle
  app.post(
    '/cycles',
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
        const body = CreateCycleRequestSchema.parse(request.body);
        const result = await createCycle.execute(body, userId);
        return reply.status(201).send({ data: serializeCycle(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /cycles/:cycleId - Get cycle
  app.get(
    '/cycles/:cycleId',
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
        const params = CycleIdParamsSchema.parse(request.params);
        const result = await getCycle.execute(params.cycleId, userId);
        return reply.status(200).send({ data: serializeCycle(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /teams/:teamId/cycles - List cycles for team
  app.get(
    '/teams/:teamId/cycles',
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
        const params = TeamIdParamsSchema.parse(request.params);
        const query = ListCyclesQuerySchema.parse(request.query);
        const result = await listCycles.execute(params.teamId, userId, query.status, query.cursor, query.limit);
        const data = result.data.map(serializeCycle);
        return reply.status(200).send({ data, pagination: result.pagination });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /cycles/:cycleId - Update cycle
  app.patch(
    '/cycles/:cycleId',
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
        const params = CycleIdParamsSchema.parse(request.params);
        const body = UpdateCycleRequestSchema.parse(request.body);
        const result = await updateCycle.execute(params.cycleId, body, userId);
        return reply.status(200).send({ data: serializeCycle(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // POST /cycles/:cycleId/activate - Activate cycle
  app.post(
    '/cycles/:cycleId/activate',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }
        const params = CycleIdParamsSchema.parse(request.params);
        const result = await activateCycle.execute(params.cycleId, userId);
        return reply.status(200).send({ data: serializeCycle(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // POST /cycles/:cycleId/complete - Complete cycle
  app.post(
    '/cycles/:cycleId/complete',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }
        const params = CycleIdParamsSchema.parse(request.params);
        const result = await completeCycle.execute(params.cycleId, userId);
        return reply.status(200).send({ data: serializeCycle(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // DELETE /cycles/:cycleId - Delete cycle (Draft only)
  app.delete(
    '/cycles/:cycleId',
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
        const params = CycleIdParamsSchema.parse(request.params);
        await deleteCycle.execute(params.cycleId, userId);
        return reply.status(204).send();
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );
}
