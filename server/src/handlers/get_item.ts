
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type GetItemInput, type Item } from '../schema';

export const getItem = async (input: GetItemInput): Promise<Item | null> => {
  try {
    const result = await db.select()
      .from(itemsTable)
      .where(eq(itemsTable.id, input.id))
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Get item failed:', error);
    throw error;
  }
};
