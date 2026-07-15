import { pgTable, uuid, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const issueLabels = pgTable('issue_labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  issueId: uuid('issue_id').notNull(),
  labelId: uuid('label_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  issueLabelUnique: uniqueIndex('idx_issue_labels_issue_label').on(table.issueId, table.labelId),
}));

export type IssueLabel = typeof issueLabels.$inferSelect;
export type NewIssueLabel = typeof issueLabels.$inferInsert;
