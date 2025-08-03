
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type CreateItemInput } from '../schema';
import { createItem } from '../handlers/create_item';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateItemInput = {
  title: 'Test Item',
  description: 'A test item for searching',
  content: 'This is the main content of the test item for search indexing'
};

describe('createItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an item', async () => {
    const result = await createItem(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Item');
    expect(result.description).toEqual(testInput.description);
    expect(result.content).toEqual(testInput.content);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save item to database', async () => {
    const result = await createItem(testInput);

    // Query using proper drizzle syntax
    const items = await db.select()
      .from(itemsTable)
      .where(eq(itemsTable.id, result.id))
      .execute();

    expect(items).toHaveLength(1);
    expect(items[0].title).toEqual('Test Item');
    expect(items[0].description).toEqual(testInput.description);
    expect(items[0].content).toEqual(testInput.content);
    expect(items[0].created_at).toBeInstanceOf(Date);
  });

  it('should create an item with null description', async () => {
    const inputWithNullDescription: CreateItemInput = {
      title: 'Item Without Description',
      description: null,
      content: 'Content for item without description'
    };

    const result = await createItem(inputWithNullDescription);

    expect(result.title).toEqual('Item Without Description');
    expect(result.description).toBeNull();
    expect(result.content).toEqual('Content for item without description');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);

    // Verify in database
    const items = await db.select()
      .from(itemsTable)
      .where(eq(itemsTable.id, result.id))
      .execute();

    expect(items[0].description).toBeNull();
  });
});
