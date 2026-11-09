export function isCacheValid(timestamp, ttlMs) {
  if (!timestamp || typeof timestamp !== 'number') return false;
  return Date.now() - timestamp < ttlMs;
}

export function buildCacheKey(page) {
  return `tongue:cache:page:${page}`;
}
