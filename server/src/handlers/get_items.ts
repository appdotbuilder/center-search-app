
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type Item } from '../schema';
import { desc } from 'drizzle-orm';

export async function getItems(): Promise<Item[]> {
  try {
    const results = await db.select()
      .from(itemsTable)
      .orderBy(desc(itemsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch items:', error);
    throw error;
  }
}
