import.meta.env.VITE_API_BASE_URL;
import.meta.env.VITE_PAGE_SIZE;

export const config = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://hacker-news.firebaseio.com/v0',
  pageSize: Number(import.meta.env.VITE_PAGE_SIZE) || 10,
  maxStories: 500,
});
