import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const issueStatuses = pgTable('issue_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull(),
  position: integer('position').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type IssueStatus = typeof issueStatuses.$inferSelect;
export type NewIssueStatus = typeof issueStatuses.$inferInsert;

export const DEFAULT_STATUSES = [
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456001', name: 'Backlog', type: 'backlog', position: 0 },
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456002', name: 'Todo', type: 'unstarted', position: 1 },
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456003', name: 'In Progress', type: 'started', position: 2 },
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456004', name: 'In Review', type: 'started', position: 3 },
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456005', name: 'Done', type: 'completed', position: 4 },
  { id: 'a1b2c3d4-e5f6-4789-abcd-ef0123456006', name: 'Canceled', type: 'canceled', position: 5 },
] as const;
