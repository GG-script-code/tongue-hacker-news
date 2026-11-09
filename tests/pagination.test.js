import { describe, it, expect } from 'vitest';
import { getNextBatch } from '@/js/utils/pagination.js';

describe('getNextBatch', () => {
  const ids = Array.from({ length: 25 }, (_, i) => i);

  it('returns the first page correctly', () => {
    expect(getNextBatch(ids, 0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('returns the second page correctly', () => {
    expect(getNextBatch(ids, 1, 10)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });

  it('returns the last partial page correctly', () => {
    expect(getNextBatch(ids, 2, 10)).toEqual([20, 21, 22, 23, 24]);
  });

  it('returns an empty array when page is beyond the end', () => {
    expect(getNextBatch(ids, 10, 10)).toEqual([]);
  });

  it('returns an empty array when input is not an array', () => {
    expect(getNextBatch(null, 0, 10)).toEqual([]);
  });
});
