import { describe, it, expect } from 'vitest';
import { filterStories } from '@/js/utils/search.js';

const stories = [
  { id: 1, title: 'JavaScript is great' },
  { id: 2, title: 'Python vs JavaScript' },
  { id: 3, title: 'Rust for systems' },
];

describe('filterStories', () => {
  it('returns all stories for empty query', () => {
    expect(filterStories(stories, '')).toEqual(stories);
    expect(filterStories(stories, '   ')).toEqual(stories);
  });

  it('filters case-insensitively', () => {
    expect(filterStories(stories, 'javascript')).toHaveLength(2);
    expect(filterStories(stories, 'JAVASCRIPT')).toHaveLength(2);
  });

  it('returns empty array if no match', () => {
    expect(filterStories(stories, 'golang')).toEqual([]);
  });

  it('returns empty array for invalid input', () => {
    expect(filterStories(null, 'x')).toEqual([]);
    expect(filterStories(undefined, 'x')).toEqual([]);
  });
});
