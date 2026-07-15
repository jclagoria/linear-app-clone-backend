import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: varchar('description', { length: 500 }),
  color: varchar('color', { length: 7 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export type Label = typeof labels.$inferSelect;
export type NewLabel = typeof labels.$inferInsert;
