
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type CreateItemInput, type Item } from '../schema';

export const createItem = async (input: CreateItemInput): Promise<Item> => {
  try {
    // Insert item record
    const result = await db.insert(itemsTable)
      .values({
        title: input.title,
        description: input.description,
        content: input.content
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Item creation failed:', error);
    throw error;
  }
};
