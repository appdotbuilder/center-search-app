
import { z } from 'zod';

// Item schema for searchable content
export const itemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  content: z.string(),
  created_at: z.coerce.date()
});

export type Item = z.infer<typeof itemSchema>;

// Input schema for creating items
export const createItemInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  content: z.string().min(1)
});

export type CreateItemInput = z.infer<typeof createItemInputSchema>;

// Input schema for search
export const searchInputSchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().positive().optional().default(10)
});

export type SearchInput = z.infer<typeof searchInputSchema>;

// Input schema for getting item by ID
export const getItemInputSchema = z.object({
  id: z.number().int().positive()
});

export type GetItemInput = z.infer<typeof getItemInputSchema>;
