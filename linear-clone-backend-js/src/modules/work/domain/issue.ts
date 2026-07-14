import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: varchar('identifier', { length: 20 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  teamId: uuid('team_id').notNull(),
  projectId: uuid('project_id'),
  assigneeId: uuid('assignee_id'),
  priority: integer('priority').notNull().default(0),
  statusId: uuid('status_id').notNull(),
  parentId: uuid('parent_id'),
  cycleId: uuid('cycle_id'),
  sortOrder: integer('sort_order').notNull().default(0),
  sequence: integer('sequence').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
  canceledAt: timestamp('canceled_at'),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  identifierTeamUnique: uniqueIndex('idx_issues_identifier_team').on(table.teamId, table.identifier).where(sql`deleted_at IS NULL`),
  sequenceTeamUnique: uniqueIndex('idx_issues_sequence_team').on(table.teamId, table.sequence),
}));

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
