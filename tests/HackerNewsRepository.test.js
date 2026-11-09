import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HackerNewsRepository } from '@/js/api/HackerNewsRepository.js';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('HackerNewsRepository', () => {
  let mockClient;
  let repo;

  beforeEach(() => {
    mockClient = { get: vi.fn() };
    repo = new HackerNewsRepository(mockClient, false);
  });

  describe('getNewStoryIds', () => {
    it('returns the list of ids', async () => {
      mockClient.get.mockResolvedValueOnce({ data: [1, 2, 3] });
      const ids = await repo.getNewStoryIds();
      expect(ids).toEqual([1, 2, 3]);
    });

    it('returns empty array if response is not an array', async () => {
      mockClient.get.mockResolvedValueOnce({ data: null });
      const ids = await repo.getNewStoryIds();
      expect(ids).toEqual([]);
    });
  });

  describe('getStoryDetails', () => {
    it('normalizes a full story', async () => {
      mockClient.get.mockResolvedValueOnce({
        data: { id: 1, title: 'Test', url: 'https://test.com', time: 123 },
      });
      const story = await repo.getStoryDetails(1);
      expect(story).toEqual({
        id: 1,
        title: 'Test',
        url: 'https://test.com',
        time: 123,
      });
    });

    it('builds fallback url when url is missing', async () => {
      mockClient.get.mockResolvedValueOnce({
        data: { id: 42, title: 'No URL', time: 123 },
      });
      const story = await repo.getStoryDetails(42);
      expect(story.url).toBe('https://news.ycombinator.com/item?id=42');
    });

    it('returns null when server returns null (deleted item)', async () => {
      mockClient.get.mockResolvedValueOnce({ data: null });
      const story = await repo.getStoryDetails(999);
      expect(story).toBeNull();
    });
  });

  describe('getStoriesBatch', () => {
    it('returns empty array for empty input', async () => {
      const stories = await repo.getStoriesBatch([]);
      expect(stories).toEqual([]);
    });

    it('filters out null items and keeps the rest', async () => {
      mockClient.get
        .mockResolvedValueOnce({ data: { id: 1, title: 'A', url: 'https://a.com', time: 1 } })
        .mockResolvedValueOnce({ data: null })
        .mockResolvedValueOnce({ data: { id: 3, title: 'C', url: 'https://c.com', time: 3 } });

      const stories = await repo.getStoriesBatch([1, 2, 3]);
      expect(stories).toHaveLength(2);
      expect(stories.map((s) => s.id)).toEqual([1, 3]);
    });

    it('returns empty array when all requests fail', async () => {
      mockClient.get.mockRejectedValue(new Error('Network error'));
      const stories = await repo.getStoriesBatch([1, 2, 3]);
      expect(stories).toEqual([]);
    });
  });

  describe('getStoriesBatch with cache', () => {
    beforeEach(() => {
      localStorageMock.clear();
    });

    it('caches stories after fetching and reuses them on second call', async () => {
      const cachedRepo = new HackerNewsRepository(mockClient, true);
      const story = { id: 1, title: 'Cached', url: 'https://c.com', time: 100 };
      mockClient.get.mockResolvedValue({ data: story });

      const first = await cachedRepo.getStoriesBatch([1]);
      expect(first).toHaveLength(1);
      expect(mockClient.get).toHaveBeenCalledTimes(1);

      const second = await cachedRepo.getStoriesBatch([1]);
      expect(second).toHaveLength(1);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('ignores expired cache entries', async () => {
      const cachedRepo = new HackerNewsRepository(mockClient, true);
      const story = { id: 2, title: 'Expired', url: 'https://e.com', time: 200 };
      mockClient.get.mockResolvedValue({ data: story });

      const cacheKey = 'tongue:cache:page:2';
      localStorageMock.setItem(
        cacheKey,
        JSON.stringify({
          stories: [story],
          timestamp: Date.now() - 20 * 60 * 1000,
        })
      );

      await cachedRepo.getStoriesBatch([2]);
      expect(mockClient.get).toHaveBeenCalledTimes(1);
    });

    it('does not cache when cache is disabled', async () => {
      const noCacheRepo = new HackerNewsRepository(mockClient, false);
      const story = { id: 3, title: 'NoCache', url: 'https://n.com', time: 300 };
      mockClient.get.mockResolvedValue({ data: story });

      await noCacheRepo.getStoriesBatch([3]);
      await noCacheRepo.getStoriesBatch([3]);
      expect(mockClient.get).toHaveBeenCalledTimes(2);
    });
  });
});
