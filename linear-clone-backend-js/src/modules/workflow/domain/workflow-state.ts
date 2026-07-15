import { pgTable, uuid, varchar, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const workflowStates = pgTable('workflow_states', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().$type<'unstarted' | 'in_progress' | 'completed' | 'canceled'>(),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  teamNameUnique: uniqueIndex('idx_workflow_states_team_name').on(table.teamId, table.name),
  teamPositionIdx: uniqueIndex('idx_workflow_states_team_position').on(table.teamId, table.position),
}));

export type WorkflowState = typeof workflowStates.$inferSelect;
export type NewWorkflowState = typeof workflowStates.$inferInsert;
