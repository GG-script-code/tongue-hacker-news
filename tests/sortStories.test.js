import { describe, it, expect } from 'vitest';
import { sortStories, SORT_CRITERIA } from '@/js/utils/sortStories.js';

const stories = [
  { id: 1, title: 'Bravo', time: 200 },
  { id: 2, title: 'Alpha', time: 100 },
  { id: 3, title: 'Charlie', time: 300 },
];

describe('sortStories', () => {
  it('sorts newest first', () => {
    const result = sortStories(stories, SORT_CRITERIA.NEWEST_FIRST);
    expect(result.map((s) => s.id)).toEqual([3, 1, 2]);
  });

  it('sorts oldest first', () => {
    const result = sortStories(stories, SORT_CRITERIA.OLDEST_FIRST);
    expect(result.map((s) => s.id)).toEqual([2, 1, 3]);
  });

  it('sorts title A-Z', () => {
    const result = sortStories(stories, SORT_CRITERIA.TITLE_ASC);
    expect(result.map((s) => s.title)).toEqual(['Alpha', 'Bravo', 'Charlie']);
  });

  it('sorts title Z-A', () => {
    const result = sortStories(stories, SORT_CRITERIA.TITLE_DESC);
    expect(result.map((s) => s.title)).toEqual(['Charlie', 'Bravo', 'Alpha']);
  });

  it('does not mutate original array', () => {
    const original = [...stories];
    sortStories(stories, SORT_CRITERIA.NEWEST_FIRST);
    expect(stories).toEqual(original);
  });

  it('returns empty for invalid input', () => {
    expect(sortStories(null, SORT_CRITERIA.NEWEST_FIRST)).toEqual([]);
  });
});
