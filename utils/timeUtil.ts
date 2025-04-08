import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

export function currentTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function currentDate() {
  return new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function currentTimeFormat(date: Date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function currentDateFormat(date: Date) {
  return date.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function daysBetween(start: Date, end: Date): number {
  const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / oneDay);
}

export const timeAgo = (timestamp: Date) => formatDistanceToNow(timestamp, { locale: ko, addSuffix: true });
