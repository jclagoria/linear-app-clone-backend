import { pgTable, uuid, timestamp, index } from 'drizzle-orm/pg-core';

export const stateHistory = pgTable('state_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').notNull(),
  fromStateId: uuid('from_state_id'),
  toStateId: uuid('to_state_id').notNull(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  issueCreatedAtIdx: index('idx_state_history_issue_created').on(table.issueId, table.createdAt),
}));

export type StateHistoryEntry = typeof stateHistory.$inferSelect;
export type NewStateHistoryEntry = typeof stateHistory.$inferInsert;
