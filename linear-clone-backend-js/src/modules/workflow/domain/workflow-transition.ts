import { pgTable, uuid, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const workflowTransitions = pgTable('workflow_transitions', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromStateId: uuid('from_state_id').notNull(),
  toStateId: uuid('to_state_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  fromToUnique: uniqueIndex('idx_workflow_transitions_from_to').on(table.fromStateId, table.toStateId),
}));

export type WorkflowTransition = typeof workflowTransitions.$inferSelect;
export type NewWorkflowTransition = typeof workflowTransitions.$inferInsert;
