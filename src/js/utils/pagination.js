export function getNextBatch(allIds, page, pageSize) {
  if (!Array.isArray(allIds)) return [];
  const start = page * pageSize;
  return allIds.slice(start, start + pageSize);
}
