import { eq, sql } from 'drizzle-orm';
import { db } from '../../../../shared/database';
import {
  notificationPreferences,
  NotificationPreferences,
} from '../../domain/notification-preferences';
import { NotificationPreferencesRepository } from '../../application/ports/notification-preferences-repository';

const DEFAULT_TYPES: Record<string, boolean> = {
  issue_assigned: true,
  issue_mentioned: true,
  comment_added: true,
  statusChanged: true,
  cycle_started: true,
  cycle_completed: true,
};

export class DrizzleNotificationPreferencesRepository
  implements NotificationPreferencesRepository
{
  async getByUserId(
    userId: string,
  ): Promise<NotificationPreferences | null> {
    const result = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  async upsert(
    userId: string,
    data: Partial<Omit<NotificationPreferences, 'userId'>>,
  ): Promise<NotificationPreferences> {
    const existing = await this.getByUserId(userId);

    if (existing) {
      const result = await db
        .update(notificationPreferences)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(notificationPreferences.userId, userId))
        .returning();

      return result[0];
    }

    const result = await db
      .insert(notificationPreferences)
      .values({
        userId,
        inApp: data.inApp ?? true,
        email: data.email ?? false,
        types: (data.types as Record<string, boolean>) ?? DEFAULT_TYPES,
      })
      .returning();

    return result[0];
  }
}
