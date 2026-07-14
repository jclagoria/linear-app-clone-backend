import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const issueStatuses = pgTable('issue_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull(), // backlog, unstarted, started, completed, canceled
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type IssueStatus = typeof issueStatuses.$inferSelect;
export type NewIssueStatus = typeof issueStatuses.$inferInsert;
