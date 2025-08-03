
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type SearchInput, type Item } from '../schema';
import { or, ilike } from 'drizzle-orm';

export async function searchItems(input: SearchInput): Promise<Item[]> {
  try {
    // Build search conditions for title, description, and content
    const searchPattern = `%${input.query}%`;
    
    const results = await db.select()
      .from(itemsTable)
      .where(
        or(
          ilike(itemsTable.title, searchPattern),
          ilike(itemsTable.description, searchPattern),
          ilike(itemsTable.content, searchPattern)
        )
      )
      .limit(input.limit)
      .execute();

    return results;
  } catch (error) {
    console.error('Item search failed:', error);
    throw error;
  }
}
