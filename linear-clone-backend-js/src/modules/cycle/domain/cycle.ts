import { pgTable, uuid, varchar, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const cycleStatusEnum = pgEnum('cycle_status', ['draft', 'active', 'completed']);

export const cycles = pgTable('cycles', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: cycleStatusEnum('status').notNull().default('draft'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export type Cycle = typeof cycles.$inferSelect;
export type NewCycle = typeof cycles.$inferInsert;
