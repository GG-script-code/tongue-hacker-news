import { describe, it, expect } from 'vitest';
import { isCacheValid, buildCacheKey } from '@/js/utils/cache.js';

describe('cache utils', () => {
  describe('isCacheValid', () => {
    it('returns true for a recent timestamp', () => {
      const now = Date.now();
      expect(isCacheValid(now - 1000, 10_000)).toBe(true);
    });

    it('returns false for an expired timestamp', () => {
      const now = Date.now();
      expect(isCacheValid(now - 20_000, 10_000)).toBe(false);
    });

    it('returns false for null or invalid timestamp', () => {
      expect(isCacheValid(null, 10_000)).toBe(false);
      expect(isCacheValid('not-a-number', 10_000)).toBe(false);
      expect(isCacheValid(undefined, 10_000)).toBe(false);
    });
  });

  describe('buildCacheKey', () => {
    it('builds a deterministic key from an id string', () => {
      expect(buildCacheKey('1,2,3')).toBe('tongue:cache:page:1,2,3');
    });

    it('builds different keys for different inputs', () => {
      expect(buildCacheKey('1,2,3')).not.toBe(buildCacheKey('4,5,6'));
    });
  });
});
