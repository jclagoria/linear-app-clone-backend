import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { UpdateProfileRequestSchema, CreateOrganizationRequestSchema, OrganizationIdParamsSchema } from './dto';
import { GetUserProfile } from '../../application/get-user-profile';
import { UpdateUserProfile } from '../../application/update-user-profile';
import { CreateOrganization } from '../../application/create-organization';
import { ListUserOrganizations } from '../../application/list-user-organizations';
import { GetOrganizationDetails } from '../../application/get-organization-details';
import { DeleteOrganization } from '../../application/delete-organization';
import { DrizzleUserProfileRepository } from '../out/drizzle-user-profile-repository';
import { DrizzleOrganizationRepository } from '../out/drizzle-organization-repository';
import { DrizzleOrganizationMemberRepository } from '../out/drizzle-organization-member-repository';
import { InMemoryEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../out/token-service';
import {
  ProfileNotFoundError,
  OrganizationNotFoundError,
  OrganizationNameConflictError,
  NotOrganizationMemberError,
  NotOrganizationOwnerError,
} from '../../domain/errors';

// Initialize dependencies
const userProfileRepository = new DrizzleUserProfileRepository();
const organizationRepository = new DrizzleOrganizationRepository();
const organizationMemberRepository = new DrizzleOrganizationMemberRepository();
const eventPublisher = new InMemoryEventPublisher();
const tokenService = new JoseTokenService();

const getUserProfile = new GetUserProfile(userProfileRepository);
const updateUserProfile = new UpdateUserProfile(userProfileRepository, eventPublisher);
const createOrganization = new CreateOrganization(organizationRepository, organizationMemberRepository, eventPublisher);
const listUserOrganizations = new ListUserOrganizations(organizationMemberRepository, organizationRepository);
const getOrganizationDetails = new GetOrganizationDetails(organizationRepository, organizationMemberRepository);
const deleteOrganization = new DeleteOrganization(organizationRepository, organizationMemberRepository, eventPublisher);

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
}
