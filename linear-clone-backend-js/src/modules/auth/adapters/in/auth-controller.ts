import { z } from 'zod';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUser, RegisterUserInput, ConflictError } from '../../application/register-user';
import { LoginUser, LoginUserInput, UnauthorizedError } from '../../application/login-user';
import {
  RefreshToken,
  TokenExpiredError,
  TokenRevokedError,
} from '../../application/refresh-token';
import { LogoutUser } from '../../application/logout-user';
import { DrizzleUserRepository } from '../out/drizzle-user-repository';
import { RedisSessionStore } from '../out/redis-session-store';
import { JoseTokenService } from '../out/token-service';
import { InMemoryEventPublisher } from '../out/in-memory-event-publisher';
import { env } from '../../../../shared/config/env';

// Initialize dependencies
const userRepository = new DrizzleUserRepository();
const sessionRepository = new RedisSessionStore();
const tokenService = new JoseTokenService();
const eventPublisher = new InMemoryEventPublisher();

const registerUser = new RegisterUser(userRepository, tokenService, eventPublisher);
const loginUser = new LoginUser(userRepository, sessionRepository, tokenService, eventPublisher);
const refreshToken = new RefreshToken(sessionRepository, tokenService);
const logoutUser = new LogoutUser(sessionRepository, eventPublisher);

// Request schemas
const RegisterRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
});

const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export async function authRoutes(app: FastifyInstance) {
  // POST /register with rate limiting
  app.post(
    '/register',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_REGISTER,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const input = RegisterRequestSchema.parse(request.body);
        const result = await registerUser.execute(input);

        return reply.status(201).send({
          data: result,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
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

        if (error instanceof ConflictError) {
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

  // POST /login with rate limiting
  app.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_LOGIN,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = LoginRequestSchema.parse(request.body);
        const ipAddress = request.ip;
        const userAgent = request.headers['user-agent'] || 'unknown';

        const result = await loginUser.execute({
          ...body,
          ipAddress,
          userAgent,
        });

        return reply.status(200).send({
          data: result,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
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

        if (error instanceof UnauthorizedError) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: error.message,
            },
          });
        }

        throw error;
      }
    },
  );

  // POST /refresh - Token refresh endpoint
  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = RefreshTokenRequestSchema.parse(request.body);
      const result = await refreshToken.execute(body);

      return reply.status(200).send({
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(422).send({
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid input',
            details: error.issues.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        });
      }

      if (error instanceof TokenExpiredError) {
        return reply.status(401).send({
          error: {
            code: 'TOKEN_EXPIRED',
            message: error.message,
          },
        });
      }

      if (error instanceof TokenRevokedError) {
        return reply.status(401).send({
          error: {
            code: 'TOKEN_REVOKED',
            message: error.message,
          },
        });
      }

      throw error;
    }
  });

  // POST /logout - Logout endpoint
  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Extract and validate access token from Authorization header
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }

      const token = authHeader.substring(7);
      const tokenResult = await tokenService.verifyAccessToken(token);

      if (!tokenResult.valid || !tokenResult.userId) {
        return reply.status(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired access token',
          },
        });
      }

      await logoutUser.execute({ userId: tokenResult.userId });

      return reply.status(200).send({
        data: { success: true },
      });
    } catch (error) {
      throw error;
    }
  });
}
