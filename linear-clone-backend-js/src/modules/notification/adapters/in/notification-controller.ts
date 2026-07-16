import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { DrizzleNotificationRepository } from '../out/drizzle-notification-repository';
import { DrizzleNotificationPreferencesRepository } from '../out/drizzle-notification-preferences-repository';
import { InMemoryNotificationEventPublisher } from '../out/in-memory-event-publisher';
import { JoseTokenService } from '../../../identity/adapters/out/token-service';
import {
  ListNotificationsQuerySchema,
  NotificationIdParamsSchema,
  UpdatePreferencesBodySchema,
  NotificationResponse,
  NotificationListResponse,
  NotificationPreferencesResponse,
  MarkReadResponse,
  MarkAllReadResponse,
} from './dto';
import { CreateNotification } from '../../application/create-notification';
import { ListNotifications } from '../../application/list-notifications';
import { MarkNotificationRead } from '../../application/mark-notification-read';
import { MarkAllNotificationsRead } from '../../application/mark-all-notifications-read';
import { GetNotificationPreferences } from '../../application/get-notification-preferences';
import { UpdateNotificationPreferences } from '../../application/update-notification-preferences';
import {
  NotificationNotFoundError,
  NotificationNotOwnerError,
  InvalidNotificationTypeError,
  InvalidFilterError,
} from '../../domain/errors';

// ─── DI Setup ─────────────────────────────────────────────────
const notificationRepository = new DrizzleNotificationRepository();
const preferencesRepository = new DrizzleNotificationPreferencesRepository();
const eventPublisher = new InMemoryNotificationEventPublisher();
const tokenService = new JoseTokenService();

// ─── Use cases ────────────────────────────────────────────────
const listNotifications = new ListNotifications(notificationRepository);
const markNotificationRead = new MarkNotificationRead(
  notificationRepository,
  eventPublisher,
);
const markAllNotificationsRead = new MarkAllNotificationsRead(
  notificationRepository,
  eventPublisher,
);
const getNotificationPreferences = new GetNotificationPreferences(
  preferencesRepository,
);
const updateNotificationPreferences = new UpdateNotificationPreferences(
  preferencesRepository,
);

// ─── Auth helper ──────────────────────────────────────────────
async function getUserIdFromToken(
  request: FastifyRequest,
): Promise<string | null> {
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

// ─── Serializers ──────────────────────────────────────────────
function serializeNotification(n: any): NotificationResponse {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    body: n.body ?? null,
    link: n.link ?? null,
    readAt: n.readAt instanceof Date ? n.readAt.toISOString() : (n.readAt ?? null),
    createdAt:
      n.createdAt instanceof Date
        ? n.createdAt.toISOString()
        : String(n.createdAt),
  };
}

// ─── Error handler ────────────────────────────────────────────
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

  if (error instanceof NotificationNotFoundError) {
    return reply.status(404).send({
      error: { code: 'NOT_FOUND', message: error.message },
    });
  }

  if (error instanceof NotificationNotOwnerError) {
    return reply.status(403).send({
      error: { code: 'FORBIDDEN', message: error.message },
    });
  }

  if (error instanceof InvalidNotificationTypeError) {
    return reply.status(422).send({
      error: { code: 'VALIDATION_ERROR', message: error.message },
    });
  }

  if (error instanceof InvalidFilterError) {
    return reply.status(422).send({
      error: { code: 'VALIDATION_ERROR', message: error.message },
    });
  }

  throw error;
}

// ─── Routes ───────────────────────────────────────────────────
export async function notificationRoutes(app: FastifyInstance) {
  // GET /notifications — List notifications
  app.get(
    '/notifications',
    {
      config: {
        rateLimit: { max: 60, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply
            .status(401)
            .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const query = ListNotificationsQuerySchema.parse(request.query);
        const result = await listNotifications.execute(query, userId);
        const data = result.data.map(serializeNotification);

        return reply.status(200).send({
          data,
          unreadCount: result.unreadCount,
          pagination: result.pagination,
        });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /notifications/:id/read — Mark notification as read
  app.patch(
    '/notifications/:id/read',
    {
      config: {
        rateLimit: { max: 60, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply
            .status(401)
            .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const params = NotificationIdParamsSchema.parse(request.params);
        const result = await markNotificationRead.execute(params, userId);

        return reply.status(200).send(result satisfies MarkReadResponse);
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /notifications/read-all — Mark all notifications as read
  app.patch(
    '/notifications/read-all',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply
            .status(401)
            .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const result = await markAllNotificationsRead.execute(userId);

        return reply.status(200).send(result satisfies MarkAllReadResponse);
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // GET /notifications/preferences — Get notification preferences
  app.get(
    '/notifications/preferences',
    {
      config: {
        rateLimit: { max: 60, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply
            .status(401)
            .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const result = await getNotificationPreferences.execute(userId);

        return reply.status(200).send({ data: result satisfies NotificationPreferencesResponse });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );

  // PATCH /notifications/preferences — Update notification preferences
  app.patch(
    '/notifications/preferences',
    {
      config: {
        rateLimit: { max: 30, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = await getUserIdFromToken(request);
        if (!userId) {
          return reply
            .status(401)
            .send({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
        }

        const body = UpdatePreferencesBodySchema.parse(request.body);
        const result = await updateNotificationPreferences.execute(body, userId);

        return reply.status(200).send({ data: result satisfies NotificationPreferencesResponse });
      } catch (error) {
        return handleControllerError(error, reply);
      }
    },
  );
}
