import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const issueComments = pgTable('issue_comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').notNull(),
  userId: uuid('user_id').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type IssueComment = typeof issueComments.$inferSelect;
export type NewIssueComment = typeof issueComments.$inferInsert;
