
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const itemsTable = pgTable('items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'), // Nullable by default
  content: text('content').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type Item = typeof itemsTable.$inferSelect; // For SELECT operations
export type NewItem = typeof itemsTable.$inferInsert; // For INSERT operations

// Export all tables for proper query building
export const tables = { items: itemsTable };
