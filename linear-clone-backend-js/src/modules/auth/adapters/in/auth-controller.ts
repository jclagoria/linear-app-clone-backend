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
import { ListSessions, ListSessionsInput } from '../../application/list-sessions';
import { RevokeSession, RevokeSessionInput, NotFoundError as SessionNotFoundError } from '../../application/revoke-session';
import { RevokeAllSessions, RevokeAllSessionsInput } from '../../application/revoke-all-sessions';
import { DrizzleUserRepository } from '../out/drizzle-user-repository';
import { RedisSessionStore } from '../out/redis-session-store';
import { JoseTokenService } from '../out/token-service';
import { InMemoryEventPublisher } from '../out/in-memory-event-publisher';
import { env } from '../../../../shared/config/env';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
} from '../../../../shared/cookie';

// Initialize dependencies
const userRepository = new DrizzleUserRepository();
const sessionRepository = new RedisSessionStore();
const tokenService = new JoseTokenService();
const eventPublisher = new InMemoryEventPublisher();

const registerUser = new RegisterUser(userRepository, tokenService, eventPublisher);
const loginUser = new LoginUser(userRepository, sessionRepository, tokenService, eventPublisher);
const refreshToken = new RefreshToken(sessionRepository, tokenService);
const logoutUser = new LogoutUser(sessionRepository, eventPublisher);
const listSessions = new ListSessions(sessionRepository);
const revokeSession = new RevokeSession(sessionRepository, eventPublisher);
const revokeAllSessions = new RevokeAllSessions(sessionRepository, eventPublisher);

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

// RefreshTokenRequestSchema - refreshToken is optional in body (cookie is preferred)
const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().optional(),
});

const SessionIdParamsSchema = z.object({
  sessionId: z.string().uuid('Invalid session ID format'),
});

// Helper to extract user ID and session ID from access token
async function getAuthInfo(request: FastifyRequest): Promise<{ userId: string; sessionId?: string } | null> {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const tokenResult = await tokenService.verifyAccessToken(token);

  if (!tokenResult.valid || !tokenResult.userId) {
    return null;
  }

  return { userId: tokenResult.userId, sessionId: tokenResult.sessionId };
}

// Helper to get current session's refresh token hash
async function getCurrentSessionRefreshTokenHash(userId: string, sessionId: string | undefined): Promise<string> {
  if (!sessionId) {
    return '';
  }

  const session = await sessionRepository.findById(sessionId, userId);
  return session?.refreshTokenHash || '';
}

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

        // Set refresh token as HttpOnly cookie
        setRefreshTokenCookie(reply, result.refreshToken);

        return reply.status(201).send({
          data: {
            user: result.user,
            accessToken: result.accessToken,
          },
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

        // Set refresh token as HttpOnly cookie
        setRefreshTokenCookie(reply, result.refreshToken, body.rememberMe);

        return reply.status(200).send({
          data: {
            user: result.user,
            accessToken: result.accessToken,
          },
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
      // Read refreshToken from cookie first, then body fallback
      const refreshTokenFromCookie = getRefreshTokenCookie(request);
      const body = request.body as { refreshToken?: string };
      const refreshTokenValue = refreshTokenFromCookie || body?.refreshToken;

      if (!refreshTokenValue) {
        return reply.status(422).send({
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Refresh token is required',
          },
        });
      }

      const result = await refreshToken.execute({ refreshToken: refreshTokenValue });

      // Set rotated refresh token as new HttpOnly cookie
      setRefreshTokenCookie(reply, result.refreshToken);

      return reply.status(200).send({
        data: { accessToken: result.accessToken },
      });
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        // Clear expired token cookie
        clearRefreshTokenCookie(reply);
        return reply.status(401).send({
          error: {
            code: 'TOKEN_EXPIRED',
            message: error.message,
          },
        });
      }

      if (error instanceof TokenRevokedError) {
        // Clear revoked token cookie
        clearRefreshTokenCookie(reply);
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

      // Clear refresh token cookie
      clearRefreshTokenCookie(reply);

      return reply.status(200).send({
        data: { success: true },
      });
    } catch (error) {
      throw error;
    }
  });

  // GET /sessions - List all active sessions for the current user
  app.get(
    '/sessions',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_SESSION_LIST,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authInfo = await getAuthInfo(request);
        if (!authInfo) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const currentRefreshTokenHash = await getCurrentSessionRefreshTokenHash(authInfo.userId, authInfo.sessionId);

        const result = await listSessions.execute({
          userId: authInfo.userId,
          currentRefreshTokenHash,
        });

        return reply.status(200).send({
          data: result,
        });
      } catch (error) {
        throw error;
      }
    },
  );

  // DELETE /sessions/:sessionId - Revoke a specific session
  app.delete(
    '/sessions/:sessionId',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_SESSION_REVOKE,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authInfo = await getAuthInfo(request);
        if (!authInfo) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const params = SessionIdParamsSchema.parse(request.params);
        await revokeSession.execute({
          userId: authInfo.userId,
          sessionId: params.sessionId,
        });

        return reply.status(200).send({
          data: { success: true },
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

        if (error instanceof SessionNotFoundError) {
          return reply.status(404).send({
            error: {
              code: 'NOT_FOUND',
              message: 'Session not found',
            },
          });
        }

        throw error;
      }
    },
  );

  // POST /sessions/revoke-all - Revoke all sessions except current
  app.post(
    '/sessions/revoke-all',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_SESSION_REVOKE_ALL,
          timeWindow: '1 minute',
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authInfo = await getAuthInfo(request);
        if (!authInfo) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Authentication required',
            },
          });
        }

        const currentRefreshTokenHash = await getCurrentSessionRefreshTokenHash(authInfo.userId, authInfo.sessionId);

        const result = await revokeAllSessions.execute({
          userId: authInfo.userId,
          currentRefreshTokenHash,
        });

        return reply.status(200).send({
          data: result,
        });
      } catch (error) {
        throw error;
      }
    },
  );
}
