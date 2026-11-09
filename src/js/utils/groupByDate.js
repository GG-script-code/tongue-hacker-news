function getDayLabel(date) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((todayStart - targetStart) / (24 * 60 * 60 * 1000));

  if (diffDays === 0) return 'Oggi';
  if (diffDays === 1) return 'Ieri';

  return new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function groupStoriesByDate(stories) {
  if (!Array.isArray(stories)) return [];

  const sorted = [...stories].sort((a, b) => b.time - a.time);
  const groups = new Map();

  for (const story of sorted) {
    const storyDate = new Date(story.time * 1000);
    const key = new Date(
      storyDate.getFullYear(),
      storyDate.getMonth(),
      storyDate.getDate()
    ).toISOString();
    if (!groups.has(key)) {
      groups.set(key, { label: getDayLabel(storyDate), stories: [] });
    }
    groups.get(key).stories.push(story);
  }

  return Array.from(groups.values());
}
