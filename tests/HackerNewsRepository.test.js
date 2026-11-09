import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HackerNewsRepository } from '@/js/api/HackerNewsRepository.js';

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
});
