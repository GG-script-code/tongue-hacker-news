import { describe, it, expect } from 'vitest';
import { groupStoriesByDate } from '@/js/utils/groupByDate.js';

describe('groupStoriesByDate', () => {
  it('groups stories by day', () => {
    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - 24 * 60 * 60;
    const stories = [
      { id: 1, title: 'A', time: now },
      { id: 2, title: 'B', time: now - 100 },
      { id: 3, title: 'C', time: yesterday },
    ];
    const groups = groupStoriesByDate(stories);
    expect(groups).toHaveLength(2);
    expect(groups[0].label).toBe('Oggi');
    expect(groups[0].stories).toHaveLength(2);
    expect(groups[1].label).toBe('Ieri');
    expect(groups[1].stories).toHaveLength(1);
  });

  it('returns empty for invalid input', () => {
    expect(groupStoriesByDate(null)).toEqual([]);
  });

  it('formats older dates with full date label', () => {
    const now = Math.floor(Date.now() / 1000);
    const threeDaysAgo = now - 3 * 24 * 60 * 60;
    const stories = [{ id: 1, title: 'Old', time: threeDaysAgo }];
    const groups = groupStoriesByDate(stories);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).not.toBe('Oggi');
    expect(groups[0].label).not.toBe('Ieri');
    expect(groups[0].label.length).toBeGreaterThan(3);
  });
});
