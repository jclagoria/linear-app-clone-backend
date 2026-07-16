import { pgTable, uuid, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../../identity/domain/user';

export const notificationPreferences = pgTable('notification_preferences', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id),
  inApp: boolean('in_app').notNull().default(true),
  email: boolean('email').notNull().default(false),
  types: jsonb('types').notNull().$type<Record<string, boolean>>(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type NotificationPreferences =
  typeof notificationPreferences.$inferSelect;
export type NewNotificationPreferences =
  typeof notificationPreferences.$inferInsert;
