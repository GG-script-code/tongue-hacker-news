export function filterStories(stories, query) {
  if (!Array.isArray(stories)) return [];
  const normalized = String(query || '')
    .trim()
    .toLowerCase();
  if (normalized === '') return stories;
  return stories.filter((story) => story.title.toLowerCase().includes(normalized));
}
