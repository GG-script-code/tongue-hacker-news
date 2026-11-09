export const SORT_CRITERIA = {
  NEWEST_FIRST: 'newest',
  OLDEST_FIRST: 'oldest',
  TITLE_ASC: 'title-asc',
  TITLE_DESC: 'title-desc',
};

export function sortStories(stories, criterion) {
  if (!Array.isArray(stories)) return [];
  const copy = [...stories];

  switch (criterion) {
    case SORT_CRITERIA.OLDEST_FIRST:
      return copy.sort((a, b) => a.time - b.time);
    case SORT_CRITERIA.TITLE_ASC:
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case SORT_CRITERIA.TITLE_DESC:
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case SORT_CRITERIA.NEWEST_FIRST:
    default:
      return copy.sort((a, b) => b.time - a.time);
  }
}
