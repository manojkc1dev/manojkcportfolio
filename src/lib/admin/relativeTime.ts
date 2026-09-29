/**
 * Formats a timestamp into relative time string (e.g., "just now", "3 days ago", "1 month ago")
 */
export function formatRelativeTime(timestamp: number | string | Date): string {
  if (!timestamp) return 'Unknown';

  const date = typeof timestamp === 'number' || typeof timestamp === 'string'
    ? new Date(timestamp)
    : timestamp;

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (isNaN(diffSec)) return 'Unknown';
  if (diffSec < 60) return 'just now';

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;

  const diffMonth = Math.floor(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth} ${diffMonth === 1 ? 'month' : 'months'} ago`;

  const diffYear = Math.floor(diffDay / 365);
  return `${diffYear} ${diffYear === 1 ? 'year' : 'years'} ago`;
}
