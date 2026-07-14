import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  key: varchar('key', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
}, (table) => ({
  teamKeyUniquePerOrg: uniqueIndex('idx_team_key_unique_per_org').on(table.organizationId, table.key).where(sql`deleted_at IS NULL`),
}));

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
