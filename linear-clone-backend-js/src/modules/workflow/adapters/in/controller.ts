import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  WorkflowParamsSchema,
  WorkflowStateParamsSchema,
  CreateWorkflowStateSchema,
  UpdateWorkflowStateSchema,
  TransitionParamsSchema,
  CreateTransitionSchema,
  ValidateTransitionSchema,
  ListTransitionsQuerySchema,
  IssueHistoryParamsSchema,
  ListHistoryQuerySchema,
} from './dto';
import { DrizzleStateRepository } from '../out/drizzle-state-repository';
import { DrizzleTransitionRepository } from '../out/drizzle-transition-repository';
import { DrizzleHistoryRepository } from '../out/drizzle-history-repository';
import { ListWorkflowStates } from '../../application/list-workflow-states';
import { CreateWorkflowState } from '../../application/create-workflow-state';
import { UpdateWorkflowState } from '../../application/update-workflow-state';
import { DeleteWorkflowState } from '../../application/delete-workflow-state';
import { ListTransitions } from '../../application/list-transitions';
import { CreateTransition } from '../../application/create-transition';
import { DeleteTransition } from '../../application/delete-transition';
import { ValidateTransition } from '../../application/validate-transition';
import { GetStateHistory } from '../../application/get-state-history';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../../identity/domain/team-member';
import { eq, and, isNull } from 'drizzle-orm';
import {
  StateNotFoundError,
  TransitionNotFoundError,
  DuplicateStateNameError,
  DuplicateTransitionError,
  StateInUseError,
  MultipleCanceledStatesError,
  NotTeamAdminError,
} from '../../domain/errors';

const stateRepository = new DrizzleStateRepository();
const transitionRepository = new DrizzleTransitionRepository();
const historyRepository = new DrizzleHistoryRepository();
const tokenService = new JoseTokenService();

const teamAdminQuery = {
  async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId), eq(teamMembers.role, 'admin'), isNull(teamMembers.deletedAt)))
      .limit(1);
    return result.length > 0;
  },
};

const listWorkflowStates = new ListWorkflowStates(stateRepository);
const createWorkflowState = new CreateWorkflowState(stateRepository, teamAdminQuery);
const updateWorkflowState = new UpdateWorkflowState(stateRepository, teamAdminQuery);
const deleteWorkflowState = new DeleteWorkflowState(stateRepository, transitionRepository, teamAdminQuery);
const listTransitions = new ListTransitions(transitionRepository);
const createTransition = new CreateTransition(transitionRepository, stateRepository, teamAdminQuery);
const deleteTransition = new DeleteTransition(transitionRepository, teamAdminQuery);
const validateTransition = new ValidateTransition(stateRepository, transitionRepository);
const getStateHistory = new GetStateHistory(historyRepository);

async function getUserIdFromToken(request: FastifyRequest): Promise<string | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);
  if (!tokenResult.valid || !tokenResult.userId) return null;
  return tokenResult.userId;
}

function serializeState(state: any) {
  return {
    id: state.id,
    teamId: state.teamId,
    name: state.name,
    type: state.type,
    position: state.position,
    createdAt: state.createdAt instanceof Date ? state.createdAt.toISOString() : state.createdAt,
    updatedAt: state.updatedAt instanceof Date ? state.updatedAt.toISOString() : state.updatedAt,
  };
}

function serializeTransition(transition: any) {
  return {
    id: transition.id,
    fromStateId: transition.fromStateId,
    toStateId: transition.toStateId,
    createdAt: transition.createdAt instanceof Date ? transition.createdAt.toISOString() : transition.createdAt,
  };
}

function serializeHistoryEntry(entry: any) {
  return {
    id: entry.id,
    issueId: entry.issueId,
    fromStateId: entry.fromStateId,
    toStateId: entry.toStateId,
    userId: entry.userId,
    createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt,
  };
}

export async function workflowRoutes(app: FastifyInstance) {
  // GET List Workflow States
  app.get(
    '/workspaces/:workspaceId/teams/:teamId/workflow/states',
    { config: { rateLimit: { max: 120, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowParamsSchema.parse(request.params);
        const result = await listWorkflowStates.execute({ teamId: params.teamId });
        return reply.status(200).send({ data: result.data.map(serializeState), total: result.total });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        throw error;
      }
    },
  );

  // POST Create Workflow State
  app.post(
    '/workspaces/:workspaceId/teams/:teamId/workflow/states',
    { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowParamsSchema.parse(request.params);
        const body = CreateWorkflowStateSchema.parse(request.body);
        const state = await createWorkflowState.execute({ ...body, teamId: params.teamId, userId });
        return reply.status(201).send({ data: serializeState(state) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof DuplicateStateNameError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        if (error instanceof MultipleCanceledStatesError) {
          return reply.status(422).send({ error: { code: 'BUSINESS_RULE_ERROR', message: error.message } });
        }
        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );

  // PUT Update Workflow State
  app.put(
    '/workspaces/:workspaceId/teams/:teamId/workflow/states/:stateId',
    { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowStateParamsSchema.parse(request.params);
        const body = UpdateWorkflowStateSchema.parse(request.body);
        const state = await updateWorkflowState.execute({ ...body, teamId: params.teamId, stateId: params.stateId, userId });
        return reply.status(200).send({ data: serializeState(state) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof StateNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof DuplicateStateNameError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        if (error instanceof MultipleCanceledStatesError) {
          return reply.status(422).send({ error: { code: 'BUSINESS_RULE_ERROR', message: error.message } });
        }
        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );

  // DELETE Delete Workflow State
  app.delete(
    '/workspaces/:workspaceId/teams/:teamId/workflow/states/:stateId',
    { config: { rateLimit: { max: 15, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowStateParamsSchema.parse(request.params);
        await deleteWorkflowState.execute({ teamId: params.teamId, stateId: params.stateId, userId });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof StateNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof StateInUseError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );

  // GET List Transitions
  app.get(
    '/workspaces/:workspaceId/teams/:teamId/workflow/transitions',
    { config: { rateLimit: { max: 120, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowParamsSchema.parse(request.params);
        const query = ListTransitionsQuerySchema.parse(request.query);
        const result = await listTransitions.execute({ teamId: params.teamId, fromStateId: query.fromStateId });
        return reply.status(200).send({ data: result.data.map(serializeTransition) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        throw error;
      }
    },
  );

  // POST Create Transition
  app.post(
    '/workspaces/:workspaceId/teams/:teamId/workflow/transitions',
    { config: { rateLimit: { max: 30, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowParamsSchema.parse(request.params);
        const body = CreateTransitionSchema.parse(request.body);
        const transition = await createTransition.execute({ ...body, teamId: params.teamId, userId });
        return reply.status(201).send({ data: serializeTransition(transition) });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof StateNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof DuplicateTransitionError) {
          return reply.status(409).send({ error: { code: 'CONFLICT', message: error.message } });
        }
        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );

  // DELETE Delete Transition
  app.delete(
    '/workspaces/:workspaceId/teams/:teamId/workflow/transitions/:transitionId',
    { config: { rateLimit: { max: 15, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = TransitionParamsSchema.parse(request.params);
        await deleteTransition.execute({ teamId: params.teamId, transitionId: params.transitionId, userId });
        return reply.status(204).send();
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof TransitionNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({ error: { code: 'FORBIDDEN', message: error.message } });
        }
        throw error;
      }
    },
  );

  // POST Validate Transition
  app.post(
    '/workspaces/:workspaceId/teams/:teamId/workflow/validate-transition',
    { config: { rateLimit: { max: 60, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = WorkflowParamsSchema.parse(request.params);
        const body = ValidateTransitionSchema.parse(request.body);

        const issue = await (await import('../../../../shared/database')).db
          .select({ id: (await import('../../../work/domain/issue')).issues.id, statusId: (await import('../../../work/domain/issue')).issues.statusId })
          .from((await import('../../../work/domain/issue')).issues)
          .where(eq((await import('../../../work/domain/issue')).issues.id, body.issueId))
          .limit(1)
          .then(r => r[0] || null);

        if (!issue) return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Issue not found' } });

        const result = await validateTransition.execute({
          teamId: params.teamId,
          issueId: body.issueId,
          toStateId: body.toStateId,
          fromStateId: issue.statusId,
        });

        return reply.status(200).send({ data: result });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        if (error instanceof StateNotFoundError) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: error.message } });
        }
        throw error;
      }
    },
  );

  // GET Get State History
  app.get(
    '/issues/:issueId/workflow/history',
    { config: { rateLimit: { max: 60, timeWindow: '1 minute' } } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) return reply.status(401).send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });

        const params = IssueHistoryParamsSchema.parse(request.params);
        const query = ListHistoryQuerySchema.parse(request.query);
        const result = await getStateHistory.execute({ issueId: params.issueId, cursor: query.cursor, limit: query.limit });
        return reply.status(200).send({
          data: result.data.map(serializeHistoryEntry),
          nextCursor: result.nextCursor,
        });
      } catch (error) {
        if (error instanceof ZodError) {
          return reply.status(400).send({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.issues.map(e => ({ field: e.path.join('.'), message: e.message })) } });
        }
        throw error;
      }
    },
  );
}
