import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { eq, and, isNull, inArray, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import { issues } from '../../../work/domain/issue';
import { issueStatuses } from '../../../work/domain/issue-status';
import { teamMembers } from '../../../identity/domain/team-member';
import {
  CreateProjectRequestSchema,
  UpdateProjectRequestSchema,
  ChangeProjectStatusRequestSchema,
  AddIssueRequestSchema,
  ListProjectsQuerySchema,
  ProjectIdParamsSchema,
  ProjectIssueParamsSchema,
  ProjectResponse,
  PaginatedProjectsResponse,
  ProjectProgressResponse,
} from './dto';
import { CreateProject } from '../../application/create-project';
import { UpdateProject } from '../../application/update-project';
import { ChangeProjectStatus } from '../../application/change-project-status';
import { GetProjectProgress } from '../../application/get-project-progress';
import { AddIssueToProject } from '../../application/add-issue-to-project';
import { RemoveIssueFromProject } from '../../application/remove-issue-from-project';
import { DeleteProject } from '../../application/delete-project';
import { DrizzleProjectRepository } from '../out/drizzle-project-repository';
import { InMemoryProjectEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';
import {
  ProjectNotFoundError,
  EmptyProjectNameError,
  NotProjectTeamMemberError,
  ProjectDateValidationError,
  InvalidProjectStatusTransitionError,
  ProjectCancelNotAdminError,
  CannotReopenCompletedProjectError,
  IssueAlreadyInProjectError,
  ProjectHardDeleteNotAllowedError,
} from '../../domain/errors';

const projectRepository = new DrizzleProjectRepository();
const eventPublisher = new InMemoryProjectEventPublisher();
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

const issueQuery = {
  async findIssueById(issueId: string): Promise<{ id: string; teamId: string; projectId: string | null } | null> {
    const result = await db
      .select({ id: issues.id, teamId: issues.teamId, projectId: issues.projectId })
      .from(issues)
      .where(eq(issues.id, issueId))
      .limit(1);
    return result[0] || null;
  },

  async countProjectIssues(projectId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(eq(issues.projectId, projectId));
    return Number(result[0]?.count || 0);
  },

  async countCompletedProjectIssues(projectId: string): Promise<number> {
    const completedStatuses = await db
      .select({ id: issueStatuses.id })
      .from(issueStatuses)
      .where(eq(issueStatuses.type, 'completed'));
    if (completedStatuses.length === 0) return 0;
    const statusIds = completedStatuses.map((s) => s.id);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(and(eq(issues.projectId, projectId), inArray(issues.statusId, statusIds)));
    return Number(result[0]?.count || 0);
  },

  async getIssuesByProject(projectId: string): Promise<Array<{ id: string }>> {
    const result = await db
      .select({ id: issues.id })
      .from(issues)
      .where(eq(issues.projectId, projectId));
    return result;
  },
};

const issueUpdateQuery = {
  async updateIssueProjectId(issueId: string, projectId: string | null): Promise<void> {
    await db
      .update(issues)
      .set({ projectId, updatedAt: new Date() })
      .where(eq(issues.id, issueId));
  },

  async getIssuesByProject(projectId: string): Promise<Array<{ id: string }>> {
    const result = await db
      .select({ id: issues.id })
      .from(issues)
      .where(eq(issues.projectId, projectId));
    return result;
  },
};

const createProject = new CreateProject(projectRepository, teamMemberQuery, eventPublisher);
const updateProject = new UpdateProject(projectRepository, teamMemberQuery, eventPublisher);
const changeProjectStatus = new ChangeProjectStatus(projectRepository, teamMemberQuery, teamAdminQuery, issueUpdateQuery, eventPublisher);
const getProjectProgress = new GetProjectProgress(projectRepository, teamMemberQuery, issueQuery);
const addIssueToProject = new AddIssueToProject(projectRepository, issueQuery, issueUpdateQuery, eventPublisher);
const removeIssueFromProject = new RemoveIssueFromProject(projectRepository, issueQuery, issueUpdateQuery, eventPublisher);
const deleteProject = new DeleteProject();

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

async function getProjectProgressData(projectId: string): Promise<{ progress: number; issueCount: number; completedIssueCount: number }> {
  const totalIssues = await issueQuery.countProjectIssues(projectId);
  const completedIssues = await issueQuery.countCompletedProjectIssues(projectId);
  const progress = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;
  return { progress, issueCount: totalIssues, completedIssueCount: completedIssues };
}

function serializeProject(project: any, progress?: { progress: number; issueCount: number; completedIssueCount: number }): ProjectResponse {
  return {
    id: project.id,
    teamId: project.teamId,
    name: project.name,
    description: project.description,
    status: project.status,
    startDate: project.startDate instanceof Date ? project.startDate.toISOString() : project.startDate,
    targetDate: project.targetDate instanceof Date ? project.targetDate.toISOString() : project.targetDate,
    progress: progress?.progress ?? 0,
    issueCount: progress?.issueCount ?? 0,
    completedIssueCount: progress?.completedIssueCount ?? 0,
    createdAt: project.createdAt instanceof Date ? project.createdAt.toISOString() : project.createdAt,
    updatedAt: project.updatedAt instanceof Date ? project.updatedAt.toISOString() : project.updatedAt,
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

  if (error instanceof ProjectNotFoundError) {
    return reply.status(404).send({
      error: { code: 'NOT_FOUND', message: error.message },
    });
  }

  if (error instanceof EmptyProjectNameError) {
    return reply.status(400).send({
      error: { code: 'VALIDATION_ERROR', message: error.message },
    });
  }

  if (error instanceof NotProjectTeamMemberError) {
    return reply.status(403).send({
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }

  if (error instanceof ProjectDateValidationError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof InvalidProjectStatusTransitionError) {
    return reply.status(403).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof ProjectCancelNotAdminError) {
    return reply.status(403).send({
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }

  if (error instanceof CannotReopenCompletedProjectError) {
    return reply.status(422).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  if (error instanceof IssueAlreadyInProjectError) {
    return reply.status(409).send({
      error: { code: 'CONFLICT', message: error.message },
    });
  }

  if (error instanceof ProjectHardDeleteNotAllowedError) {
    return reply.status(400).send({
      error: { code: 'BUSINESS_RULE_ERROR', message: error.message },
    });
  }

  throw error;
}

export async function projectRoutes(app: FastifyInstance) {
  // POST /projects - Create project
  app.post(
    '/projects',
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
        const body = CreateProjectRequestSchema.parse(request.body);
        const result = await createProject.execute(body, userId);
        return reply.status(201).send({ data: serializeProject(result) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /projects - List projects
  app.get(
    '/projects',
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
        const query = ListProjectsQuerySchema.parse(request.query);
        const result = await projectRepository.findMany(
          { teamId: query.teamId, status: query.status },
          query.cursor,
          query.limit,
        );
        const data = await Promise.all(
          result.data.map(async (project) => {
            const progress = await getProjectProgressData(project.id);
            return serializeProject(project, progress);
          }),
        );
        return reply.status(200).send({ data, pagination: result.pagination });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /projects/:projectId - Get project
  app.get(
    '/projects/:projectId',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        const project = await projectRepository.findById(params.projectId);
        if (!project) {
          return reply.status(404).send({ error: { code: 'NOT_FOUND', message: 'Project not found' } });
        }
        const progress = await getProjectProgressData(project.id);
        return reply.status(200).send({ data: serializeProject(project, progress) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /projects/:projectId - Update project
  app.patch(
    '/projects/:projectId',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        const body = UpdateProjectRequestSchema.parse(request.body);
        const result = await updateProject.execute(params.projectId, body, userId);
        const progress = await getProjectProgressData(result.id);
        return reply.status(200).send({ data: serializeProject(result, progress) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /projects/:projectId/status - Change project status
  app.patch(
    '/projects/:projectId/status',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        const body = ChangeProjectStatusRequestSchema.parse(request.body);
        const result = await changeProjectStatus.execute(params.projectId, body, userId);
        const progress = await getProjectProgressData(result.id);
        return reply.status(200).send({ data: serializeProject(result, progress) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /projects/:projectId/progress - Get project progress
  app.get(
    '/projects/:projectId/progress',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        const result = await getProjectProgress.execute(params.projectId, userId);
        return reply.status(200).send({ data: result });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // POST /projects/:projectId/issues - Add issue to project
  app.post(
    '/projects/:projectId/issues',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        const body = AddIssueRequestSchema.parse(request.body);
        const result = await addIssueToProject.execute(params.projectId, body, userId);
        const progress = await getProjectProgressData(result.id);
        return reply.status(200).send({ data: serializeProject(result, progress) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // DELETE /projects/:projectId/issues/:issueId - Remove issue from project
  app.delete(
    '/projects/:projectId/issues/:issueId',
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
        const params = ProjectIssueParamsSchema.parse(request.params);
        const result = await removeIssueFromProject.execute(params.projectId, params.issueId, userId);
        const progress = await getProjectProgressData(result.id);
        return reply.status(200).send({ data: serializeProject(result, progress) });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // DELETE /projects/:projectId - Reject (no hard delete)
  app.delete(
    '/projects/:projectId',
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
        const params = ProjectIdParamsSchema.parse(request.params);
        await deleteProject.execute(params.projectId, userId);
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );
}
