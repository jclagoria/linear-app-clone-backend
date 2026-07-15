import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  CreateIssueRequestSchema,
  UpdateIssueRequestSchema,
  ChangeIssueStatusRequestSchema,
  AssignIssueRequestSchema,
  ListIssuesQuerySchema,
  IdParamsSchema,
} from './dto';
import { CreateIssue, TeamMemberQuery as CreateTeamMemberQuery, ProjectQuery as CreateProjectQuery, TeamKeyQuery } from '../../application/create-issue';
import { UpdateIssue, ProjectQuery as UpdateProjectQuery } from '../../application/update-issue';
import { ChangeIssueStatus, IssueStatusQuery } from '../../application/change-issue-status';
import { AssignIssue, TeamMemberQuery as AssignTeamMemberQuery } from '../../application/assign-issue';
import { DeleteIssue } from '../../application/delete-issue';
import { ListIssues } from '../../application/list-issues';
import { DrizzleIssueRepository } from '../out/drizzle-issue-repository';
import { InMemoryEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';
import { db } from '../../../../shared/database';
import { teamMembers } from '../../../identity/domain/team-member';
import { eq, and, isNull } from 'drizzle-orm';
import {
  IssueNotFoundError,
  InvalidTransitionError,
  TeamMismatchError,
  NotTeamMemberError,
  EmptyTitleError,
} from '../../domain/errors';

// Initialize dependencies
const issueRepository = new DrizzleIssueRepository();
const eventPublisher = new InMemoryEventPublisher();
const tokenService = new JoseTokenService();

// Shared team membership query (reused across use cases)
const teamMemberQuery: CreateTeamMemberQuery & AssignTeamMemberQuery = {
  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId), isNull(teamMembers.deletedAt)))
      .limit(1);
    return result.length > 0;
  },
};

// Team key query for identifier generation
const teamKeyQuery: TeamKeyQuery = {
  async getTeamKey(teamId: string): Promise<string | null> {
    const { teams } = await import('../../../identity/domain/team');
    const result = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);
    return result[0]?.key || null;
  },
};

// Shared project query (reused across use cases)
const projectQuery: CreateProjectQuery & UpdateProjectQuery = {
  async getProjectTeamId(projectId: string): Promise<string | null> {
    // Project module not yet built - return null indicating no validation
    // When projects module exists, inject the real query here
    return null;
  },
};

// Issue status query
const issueStatusQuery: IssueStatusQuery = {
  async getStatusById(statusId: string) {
    // Import statuses from domain
    const { issueStatuses } = await import('../../domain/issue-status');
    const result = await db
      .select()
      .from(issueStatuses)
      .where(eq(issueStatuses.id, statusId))
      .limit(1);
    if (!result[0]) return null;
    return {
      id: result[0].id,
      type: result[0].type as any,
      name: result[0].name,
    };
  },
};

// Resolve default "Todo" status ID at initialization
let defaultStatusId = '';
try {
  const { issueStatuses, DEFAULT_STATUSES } = await import('../../domain/issue-status');
  const { seedDefaultStatuses } = await import('../../../../shared/database/seed-statuses');
  await seedDefaultStatuses();
  const todoStatus = await db
    .select()
    .from(issueStatuses)
    .where(eq(issueStatuses.name, 'Todo'))
    .limit(1);
  if (todoStatus[0]) {
    defaultStatusId = todoStatus[0].id;
  } else {
    defaultStatusId = DEFAULT_STATUSES.find((s: any) => s.name === 'Todo')?.id || '';
  }
} catch {
  defaultStatusId = '';
}

// Initialize use cases
const createIssue = new CreateIssue(issueRepository, teamMemberQuery, projectQuery, teamKeyQuery, defaultStatusId, eventPublisher);
const updateIssue = new UpdateIssue(issueRepository, projectQuery, eventPublisher);
const changeIssueStatus = new ChangeIssueStatus(issueRepository, issueStatusQuery, eventPublisher);
const assignIssue = new AssignIssue(issueRepository, teamMemberQuery, eventPublisher);
const deleteIssue = new DeleteIssue(issueRepository, eventPublisher);
const listIssues = new ListIssues(issueRepository);

// Helper to extract user ID from access token
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

function serializeIssue(issue: any) {
  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    teamId: issue.teamId,
    projectId: issue.projectId,
    assigneeId: issue.assigneeId,
    priority: issue.priority,
    statusId: issue.statusId,
    parentId: issue.parentId,
    cycleId: issue.cycleId,
    sortOrder: issue.sortOrder,
    sequence: issue.sequence,
    createdAt: issue.createdAt instanceof Date ? issue.createdAt.toISOString() : issue.createdAt,
    updatedAt: issue.updatedAt instanceof Date ? issue.updatedAt.toISOString() : issue.updatedAt,
    completedAt: issue.completedAt instanceof Date ? issue.completedAt.toISOString() : issue.completedAt,
    canceledAt: issue.canceledAt instanceof Date ? issue.canceledAt.toISOString() : issue.canceledAt,
    deletedAt: issue.deletedAt instanceof Date ? issue.deletedAt.toISOString() : issue.deletedAt,
  };
}

export async function issueRoutes(app: FastifyInstance) {
  // GET /issues - List issues
  app.get(
    '/issues',
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const query = ListIssuesQuerySchema.parse(request.query);
        const result = await listIssues.execute(query);

        return reply.status(200).send({
          data: result.data.map(serializeIssue),
          pagination: result.pagination,
        });
      } catch (error) {
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
        throw error;
      }
    },
  );

  // GET /issues/:id - Get issue
  app.get(
    '/issues/:id',
    {
      config: {
        rateLimit: {
          max: 120,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const params = IdParamsSchema.parse(request.params);
        const issue = await issueRepository.findById(params.id);

        if (!issue) {
          return reply.status(404).send({
            error: { code: 'NOT_FOUND', message: 'Issue not found' },
          });
        }

        return reply.status(200).send({ data: serializeIssue(issue) });
      } catch (error) {
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
        throw error;
      }
    },
  );

  // POST /issues - Create issue
  app.post(
    '/issues',
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const body = CreateIssueRequestSchema.parse(request.body);
        const result = await createIssue.execute(body, userId);

        return reply.status(201).send({ data: serializeIssue(result) });
      } catch (error) {
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

        if (error instanceof EmptyTitleError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: error.message },
          });
        }

        if (error instanceof NotTeamMemberError) {
          return reply.status(422).send({
            error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
          });
        }

        if (error instanceof TeamMismatchError) {
          return reply.status(422).send({
            error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
          });
        }

        throw error;
      }
    },
  );

  // PATCH /issues/:id - Update issue
  app.patch(
    '/issues/:id',
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const params = IdParamsSchema.parse(request.params);
        const body = UpdateIssueRequestSchema.parse(request.body);
        const result = await updateIssue.execute(params.id, body, userId);

        return reply.status(200).send({ data: result });
      } catch (error) {
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

        if (error instanceof IssueNotFoundError) {
          return reply.status(404).send({
            error: { code: 'NOT_FOUND', message: error.message },
          });
        }

        if (error instanceof EmptyTitleError) {
          return reply.status(400).send({
            error: { code: 'VALIDATION_ERROR', message: error.message },
          });
        }

        if (error instanceof TeamMismatchError) {
          return reply.status(422).send({
            error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
          });
        }

        throw error;
      }
    },
  );

  // PATCH /issues/:id/status - Change issue status
  app.patch(
    '/issues/:id/status',
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const params = IdParamsSchema.parse(request.params);
        const body = ChangeIssueStatusRequestSchema.parse(request.body);
        const result = await changeIssueStatus.execute(params.id, body, userId);

        return reply.status(200).send({ data: result });
      } catch (error) {
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

        if (error instanceof IssueNotFoundError) {
          return reply.status(404).send({
            error: { code: 'NOT_FOUND', message: error.message },
          });
        }

        if (error instanceof InvalidTransitionError) {
          return reply.status(422).send({
            error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
          });
        }

        throw error;
      }
    },
  );

  // PATCH /issues/:id/assignee - Assign/unassign issue
  app.patch(
    '/issues/:id/assignee',
    {
      config: {
        rateLimit: {
          max: 60,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const params = IdParamsSchema.parse(request.params);
        const body = AssignIssueRequestSchema.parse(request.body);
        const result = await assignIssue.execute(params.id, body, userId);

        return reply.status(200).send({ data: result });
      } catch (error) {
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

        if (error instanceof IssueNotFoundError) {
          return reply.status(404).send({
            error: { code: 'NOT_FOUND', message: error.message },
          });
        }

        if (error instanceof NotTeamMemberError) {
          return reply.status(422).send({
            error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
          });
        }

        throw error;
      }
    },
  );

  // DELETE /issues/:id - Delete issue (soft-delete)
  app.delete(
    '/issues/:id',
    {
      config: {
        rateLimit: {
          max: 30,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
          });
        }

        const params = IdParamsSchema.parse(request.params);
        await deleteIssue.execute(params.id, userId);

        return reply.status(204).send();
      } catch (error) {
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

        if (error instanceof IssueNotFoundError) {
          return reply.status(404).send({
            error: { code: 'NOT_FOUND', message: error.message },
          });
        }

        throw error;
      }
    },
  );
}
