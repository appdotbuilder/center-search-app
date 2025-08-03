
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type GetItemInput } from '../schema';
import { getItem } from '../handlers/get_item';

describe('getItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return an item by ID', async () => {
    // Create test item
    const insertResult = await db.insert(itemsTable)
      .values({
        title: 'Test Item',
        description: 'Test description',
        content: 'Test content'
      })
      .returning()
      .execute();

    const createdItem = insertResult[0];
    const input: GetItemInput = { id: createdItem.id };

    const result = await getItem(input);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdItem.id);
    expect(result!.title).toEqual('Test Item');
    expect(result!.description).toEqual('Test description');
    expect(result!.content).toEqual('Test content');
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return null for non-existent item', async () => {
    const input: GetItemInput = { id: 999 };

    const result = await getItem(input);

    expect(result).toBeNull();
  });

  it('should handle item with null description', async () => {
    // Create test item with null description
    const insertResult = await db.insert(itemsTable)
      .values({
        title: 'Test Item No Description',
        description: null,
        content: 'Test content without description'
      })
      .returning()
      .execute();

    const createdItem = insertResult[0];
    const input: GetItemInput = { id: createdItem.id };

    const result = await getItem(input);

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(createdItem.id);
    expect(result!.title).toEqual('Test Item No Description');
    expect(result!.description).toBeNull();
    expect(result!.content).toEqual('Test content without description');
    expect(result!.created_at).toBeInstanceOf(Date);
  });
});
