import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  UpdateProfileRequestSchema,
  CreateOrganizationRequestSchema,
  OrganizationIdParamsSchema,
  CreateTeamRequestSchema,
  TeamIdParamsSchema,
  TeamMemberUserIdParamsSchema,
  AddTeamMemberRequestSchema,
} from './dto';
import { GetUserProfile } from '../../application/get-user-profile';
import { UpdateUserProfile } from '../../application/update-user-profile';
import { CreateOrganization } from '../../application/create-organization';
import { ListUserOrganizations } from '../../application/list-user-organizations';
import { GetOrganizationDetails } from '../../application/get-organization-details';
import { DeleteOrganization } from '../../application/delete-organization';
import { CreateTeam } from '../../application/create-team';
import { ListTeams } from '../../application/list-teams';
import { GetTeamDetails } from '../../application/get-team-details';
import { DeleteTeam } from '../../application/delete-team';
import { AddTeamMember } from '../../application/add-team-member';
import { RemoveTeamMember } from '../../application/remove-team-member';
import { ListTeamMembers } from '../../application/list-team-members';
import { DrizzleUserProfileRepository } from '../out/drizzle-user-profile-repository';
import { DrizzleOrganizationRepository } from '../out/drizzle-organization-repository';
import { DrizzleOrganizationMemberRepository } from '../out/drizzle-organization-member-repository';
import { DrizzleTeamRepository } from '../out/drizzle-team-repository';
import { DrizzleTeamMemberRepository } from '../out/drizzle-team-member-repository';
import { InMemoryEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../out/token-service';
import {
  ProfileNotFoundError,
  OrganizationNotFoundError,
  OrganizationNameConflictError,
  NotOrganizationMemberError,
  NotOrganizationOwnerError,
  TeamNotFoundError,
  TeamKeyConflictError,
  NotTeamMemberError,
  NotTeamAdminError,
  AlreadyTeamMemberError,
  TeamMemberNotFoundError,
  LastAdminRemovalError,
} from '../../domain/errors';

// Initialize dependencies
const userProfileRepository = new DrizzleUserProfileRepository();
const organizationRepository = new DrizzleOrganizationRepository();
const organizationMemberRepository = new DrizzleOrganizationMemberRepository();
const teamRepository = new DrizzleTeamRepository();
const teamMemberRepository = new DrizzleTeamMemberRepository();
const eventPublisher = new InMemoryEventPublisher();
const tokenService = new JoseTokenService();

const getUserProfile = new GetUserProfile(userProfileRepository);
const updateUserProfile = new UpdateUserProfile(userProfileRepository, eventPublisher);
const createOrganization = new CreateOrganization(organizationRepository, organizationMemberRepository, eventPublisher);
const listUserOrganizations = new ListUserOrganizations(organizationMemberRepository, organizationRepository);
const getOrganizationDetails = new GetOrganizationDetails(organizationRepository, organizationMemberRepository);
const deleteOrganization = new DeleteOrganization(organizationRepository, organizationMemberRepository, eventPublisher);
const createTeam = new CreateTeam(teamRepository, teamMemberRepository, organizationMemberRepository, eventPublisher);
const listTeams = new ListTeams(teamRepository, organizationMemberRepository);
const getTeamDetails = new GetTeamDetails(teamRepository, teamMemberRepository);
const deleteTeam = new DeleteTeam(teamRepository, teamMemberRepository, eventPublisher);
const addTeamMember = new AddTeamMember(teamRepository, teamMemberRepository, organizationMemberRepository, eventPublisher);
const removeTeamMember = new RemoveTeamMember(teamRepository, teamMemberRepository, eventPublisher);
const listTeamMembers = new ListTeamMembers(teamRepository, teamMemberRepository, userProfileRepository);

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

export async function identityRoutes(app: FastifyInstance) {
  // GET /users/me - Get current user profile
  app.get(
    '/users/me',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const result = await getUserProfile.execute({ userId });

        return reply.status(200).send({
          data: { user: result },
        });
      } catch (error) {
        if (error instanceof ProfileNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // PATCH /users/me - Update current user profile
  app.patch(
    '/users/me',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const body = UpdateProfileRequestSchema.parse(request.body);
        const result = await updateUserProfile.execute({ userId, ...body });

        return reply.status(200).send({
          data: { user: result },
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

        if (error instanceof ProfileNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // POST /organizations - Create organization
  app.post(
    '/organizations',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const body = CreateOrganizationRequestSchema.parse(request.body);
        const result = await createOrganization.execute({ userId, ...body });

        return reply.status(201).send({
          data: { organization: result },
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

        if (error instanceof OrganizationNameConflictError) {
          return reply.status(409).send({
            error: {
              code: 'CONFLICT',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // GET /organizations - List user organizations
  app.get(
    '/organizations',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const result = await listUserOrganizations.execute({ userId });

        return reply.status(200).send({
          data: result,
        });
      } catch (error) {
        throw error;
      }
    },
  );

  // GET /organizations/:organizationId - Get organization details
  app.get(
    '/organizations/:organizationId',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = OrganizationIdParamsSchema.parse(request.params);
        const result = await getOrganizationDetails.execute({
          userId,
          organizationId: params.organizationId,
        });

        return reply.status(200).send({
          data: { organization: result },
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

        if (error instanceof OrganizationNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotOrganizationMemberError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // DELETE /organizations/:organizationId - Delete organization
  app.delete(
    '/organizations/:organizationId',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = OrganizationIdParamsSchema.parse(request.params);
        await deleteOrganization.execute({
          userId,
          organizationId: params.organizationId,
        });

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

        if (error instanceof OrganizationNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotOrganizationOwnerError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // POST /organizations/:organizationId/teams - Create team
  app.post(
    '/organizations/:organizationId/teams',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = OrganizationIdParamsSchema.parse(request.params);
        const body = CreateTeamRequestSchema.parse(request.body);
        const result = await createTeam.execute({
          userId,
          organizationId: params.organizationId,
          ...body,
        });

        return reply.status(201).send({
          data: { team: result },
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

        if (error instanceof NotOrganizationMemberError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        if (error instanceof TeamKeyConflictError) {
          return reply.status(409).send({
            error: {
              code: 'CONFLICT',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // GET /organizations/:organizationId/teams - List teams
  app.get(
    '/organizations/:organizationId/teams',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = OrganizationIdParamsSchema.parse(request.params);
        const result = await listTeams.execute({
          userId,
          organizationId: params.organizationId,
        });

        return reply.status(200).send({
          data: { teams: result },
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

        if (error instanceof NotOrganizationMemberError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // GET /teams/:teamId - Get team details
  app.get(
    '/teams/:teamId',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = TeamIdParamsSchema.parse(request.params);
        const result = await getTeamDetails.execute({
          userId,
          teamId: params.teamId,
        });

        return reply.status(200).send({
          data: { team: result },
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

        if (error instanceof TeamNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotTeamMemberError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // DELETE /teams/:teamId - Delete team
  app.delete(
    '/teams/:teamId',
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = TeamIdParamsSchema.parse(request.params);
        await deleteTeam.execute({
          userId,
          teamId: params.teamId,
        });

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

        if (error instanceof TeamNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // GET /teams/:teamId/members - List team members
  app.get(
    '/teams/:teamId/members',
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
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = TeamIdParamsSchema.parse(request.params);
        const result = await listTeamMembers.execute({
          userId,
          teamId: params.teamId,
        });

        return reply.status(200).send({
          data: { members: result },
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

        if (error instanceof TeamNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotTeamMemberError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // POST /teams/:teamId/members - Add team member
  app.post(
    '/teams/:teamId/members',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = TeamIdParamsSchema.parse(request.params);
        const body = AddTeamMemberRequestSchema.parse(request.body);
        const result = await addTeamMember.execute({
          userId,
          teamId: params.teamId,
          memberUserId: body.userId,
          role: body.role,
        });

        return reply.status(201).send({
          data: { member: result },
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

        if (error instanceof TeamNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        if (error instanceof NotOrganizationMemberError) {
          return reply.status(422).send({
            error: {
              code: 'BUSINESS_RULE_ERROR',
              message: error.message,
            },
          });
        }

        if (error instanceof AlreadyTeamMemberError) {
          return reply.status(409).send({
            error: {
              code: 'CONFLICT',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // DELETE /teams/:teamId/members/:userId - Remove team member
  app.delete(
    '/teams/:teamId/members/:userId',
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = TeamMemberUserIdParamsSchema.parse(request.params);
        await removeTeamMember.execute({
          userId,
          teamId: params.teamId,
          memberUserId: params.userId,
        });

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

        if (error instanceof TeamNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof NotTeamAdminError) {
          return reply.status(403).send({
            error: {
              code: 'FORBIDDEN',
              message: error.message,
            },
          });
        }

        if (error instanceof TeamMemberNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: error.message,
            },
          });
        }

        if (error instanceof LastAdminRemovalError) {
          return reply.status(422).send({
            error: {
              code: 'BUSINESS_RULE_ERROR',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );
}
