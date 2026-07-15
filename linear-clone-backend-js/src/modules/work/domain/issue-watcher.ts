import { pgTable, uuid, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const issueWatchers = pgTable('issue_watchers', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  issueUserUnique: uniqueIndex('idx_issue_watchers_issue_user').on(table.issueId, table.userId),
}));

export type IssueWatcher = typeof issueWatchers.$inferSelect;
export type NewIssueWatcher = typeof issueWatchers.$inferInsert;
