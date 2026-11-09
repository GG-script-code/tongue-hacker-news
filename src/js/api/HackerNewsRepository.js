import axios from 'axios';
import { config } from '@/js/config.js';
import { safeGet, safeSet } from '@/js/storage.js';
import { buildCacheKey, isCacheValid } from '@/js/utils/cache.js';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export class HackerNewsRepository {
  constructor(client = axios, cacheEnabled = true) {
    this.client = client;
    this.cacheEnabled = cacheEnabled;
  }

  async getNewStoryIds() {
    const { data } = await this.client.get(`${config.apiBaseUrl}/newstories.json`);
    return Array.isArray(data) ? data : [];
  }

  async getStoryDetails(id) {
    const { data } = await this.client.get(`${config.apiBaseUrl}/item/${id}.json`);
    if (!data) return null;
    return {
      id: data.id,
      title: data.title || 'Senza titolo',
      url: data.url || `https://news.ycombinator.com/item?id=${data.id}`,
      time: data.time,
    };
  }

  async getStoriesBatch(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    if (this.cacheEnabled) {
      const cacheKey = buildCacheKey(ids.join(','));
      const cached = safeGet(cacheKey);
      if (cached && isCacheValid(cached.timestamp, CACHE_TTL_MS)) {
        return cached.stories;
      }
    }

    const results = await Promise.allSettled(ids.map((id) => this.getStoryDetails(id)));
    const stories = results
      .filter((r) => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value);

    if (this.cacheEnabled && stories.length > 0) {
      const cacheKey = buildCacheKey(ids.join(','));
      safeSet(cacheKey, { stories, timestamp: Date.now() });
    }

    return stories;
  }
}
