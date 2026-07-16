import { eq, and, lt, or, gt, isNull, sql, desc } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import {
  notifications,
  Notification,
  NewNotification,
} from '../../domain/notification';
import {
  NotificationRepository,
  PaginatedResult,
} from '../../application/ports/notification-repository';

const DEFAULT_LIMIT = 20;

export class DrizzleNotificationRepository
  implements NotificationRepository
{
  async findMany(
    userId: string,
    filter?: 'read' | 'unread',
    cursor?: string,
    limit = DEFAULT_LIMIT,
  ): Promise<PaginatedResult<Notification>> {
    const conditions = [
      eq(notifications.userId, userId),
      gt(notifications.expiresAt, new Date()),
    ];

    if (filter === 'read') {
      conditions.push(isNull(notifications.readAt));
    } else if (filter === 'unread') {
      conditions.push(isNull(notifications.readAt));
    }

    if (cursor) {
      conditions.push(lt(notifications.createdAt, new Date(cursor)));
    }

    const result = await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit + 1);

    const hasMore = result.length > limit;
    const data = hasMore ? result.slice(0, limit) : result;
    const nextCursor =
      hasMore && data.length > 0
        ? data[data.length - 1].createdAt.toISOString()
        : null;

    return { data, pagination: { nextCursor, hasMore } };
  }

  async findByUserAndId(
    userId: string,
    id: string,
  ): Promise<Notification | null> {
    const result = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, id),
          eq(notifications.userId, userId),
          gt(notifications.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return result[0] || null;
  }

  async countUnread(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
          gt(notifications.expiresAt, new Date()),
        ),
      );

    return Number(result[0]?.count ?? 0);
  }

  async create(notification: NewNotification): Promise<Notification> {
    const result = await db
      .insert(notifications)
      .values(notification)
      .returning();

    return result[0];
  }

  async markRead(id: string): Promise<Notification> {
    const result = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();

    return result[0];
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await db
      .update(notifications)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, userId),
          isNull(notifications.readAt),
          gt(notifications.expiresAt, new Date()),
        ),
      )
      .returning({ id: notifications.id });

    return result.length;
  }
}
