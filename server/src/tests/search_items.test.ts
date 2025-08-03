
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { itemsTable } from '../db/schema';
import { type SearchInput } from '../schema';
import { searchItems } from '../handlers/search_items';

// Test data setup
const testItems = [
  {
    title: 'JavaScript Guide',
    description: 'Learn JavaScript programming',
    content: 'This is a comprehensive guide to JavaScript programming with examples and best practices.'
  },
  {
    title: 'Python Tutorial',
    description: 'Introduction to Python',
    content: 'Python is a versatile programming language used for web development, data science, and automation.'
  },
  {
    title: 'Database Design',
    description: null,
    content: 'Learn how to design efficient databases with proper normalization and indexing strategies.'
  },
  {
    title: 'Web Development',
    description: 'Frontend and backend development',
    content: 'Complete guide covering HTML, CSS, JavaScript, and server-side programming concepts.'
  }
];

describe('searchItems', () => {
  beforeEach(async () => {
    await createDB();
    // Insert test data
    await db.insert(itemsTable).values(testItems).execute();
  });

  afterEach(resetDB);

  it('should search items by title', async () => {
    const input: SearchInput = {
      query: 'JavaScript',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(2); // Should find "JavaScript Guide" and "Web Development"
    expect(results.some(item => item.title === 'JavaScript Guide')).toBe(true);
    expect(results.some(item => item.title === 'Web Development')).toBe(true);
  });

  it('should search items by description', async () => {
    const input: SearchInput = {
      query: 'Introduction',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Python Tutorial');
    expect(results[0].description).toEqual('Introduction to Python');
  });

  it('should search items by content', async () => {
    const input: SearchInput = {
      query: 'programming language',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Python Tutorial');
    expect(results[0].content).toContain('programming language');
  });

  it('should be case insensitive', async () => {
    const input: SearchInput = {
      query: 'PYTHON',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Python Tutorial');
  });

  it('should respect limit parameter', async () => {
    const input: SearchInput = {
      query: 'development',
      limit: 1
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(1);
    expect(['Python Tutorial', 'Web Development']).toContain(results[0].title);
  });

  it('should return empty array for no matches', async () => {
    const input: SearchInput = {
      query: 'nonexistent query',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(0);
  });

  it('should handle null description fields', async () => {
    const input: SearchInput = {
      query: 'Database Design',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results).toHaveLength(1);
    expect(results[0].title).toEqual('Database Design');
    expect(results[0].description).toBeNull();
  });

  it('should return items with all required fields', async () => {
    const input: SearchInput = {
      query: 'JavaScript',
      limit: 10
    };

    const results = await searchItems(input);

    expect(results.length).toBeGreaterThan(0);
    results.forEach(item => {
      expect(item.id).toBeDefined();
      expect(typeof item.id).toBe('number');
      expect(item.title).toBeDefined();
      expect(typeof item.title).toBe('string');
      expect(item.content).toBeDefined();
      expect(typeof item.content).toBe('string');
      expect(item.created_at).toBeInstanceOf(Date);
      // description can be null, so we don't assert its type
    });
  });
});
