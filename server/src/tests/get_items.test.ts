
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { getItems } from '../handlers/get_items';

describe('getItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no items exist', async () => {
    const result = await getItems();
    expect(result).toEqual([]);
  });

  it('should return all items ordered by created_at desc', async () => {
    // Create test items with slight delay to ensure different timestamps
    const firstItem = await db.insert(itemsTable)
      .values({
        title: 'First Item',
        description: 'First description',
        content: 'First content'
      })
      .returning()
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondItem = await db.insert(itemsTable)
      .values({
        title: 'Second Item',
        description: null,
        content: 'Second content'
      })
      .returning()
      .execute();

    const result = await getItems();

    expect(result).toHaveLength(2);
    
    // Verify items are ordered by created_at desc (newest first)
    expect(result[0].title).toEqual('Second Item');
    expect(result[0].description).toBeNull();
    expect(result[0].content).toEqual('Second content');
    expect(result[0].created_at).toBeInstanceOf(Date);
    
    expect(result[1].title).toEqual('First Item');
    expect(result[1].description).toEqual('First description');
    expect(result[1].content).toEqual('First content');
    expect(result[1].created_at).toBeInstanceOf(Date);

    // Verify ordering - second item should have later timestamp
    expect(result[0].created_at.getTime()).toBeGreaterThan(result[1].created_at.getTime());
  });

  it('should handle items with nullable descriptions', async () => {
    await db.insert(itemsTable)
      .values({
        title: 'Item with null description',
        description: null,
        content: 'Content here'
      })
      .execute();

    const result = await getItems();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Item with null description');
    expect(result[0].description).toBeNull();
    expect(result[0].content).toEqual('Content here');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });
});
