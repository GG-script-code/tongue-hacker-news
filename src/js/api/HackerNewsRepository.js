import axios from 'axios';
import { config } from '@/js/config.js';

export class HackerNewsRepository {
  constructor(client = axios) {
    this.client = client;
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
    const results = await Promise.allSettled(ids.map((id) => this.getStoryDetails(id)));
    return results.filter((r) => r.status === 'fulfilled' && r.value !== null).map((r) => r.value);
  }
}
