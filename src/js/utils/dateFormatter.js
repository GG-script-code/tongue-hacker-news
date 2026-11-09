export function formatDate(unixTimestamp) {
  if (!unixTimestamp) return 'Data sconosciuta';
  const date = new Date(unixTimestamp * 1000);
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
