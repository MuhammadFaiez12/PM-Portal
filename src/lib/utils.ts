import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPKTDate(): string {
  const now = new Date();
  return new Date(now.getTime() + 5 * 3600000).toISOString().slice(0, 10);
}

export function formatTodayLabel(dateStr?: string): string {
  const d = dateStr || getPKTDate();
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getRecentWeekdays(n: number) {
  const out: { date: string; label: string; shortLabel: string }[] = [];
  const today = new Date();
  for (let i = n + 6; i >= 0 && out.length < n; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      out.push({
        date: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
        shortLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }
  }
  return out;
}

export { MONTH_NAMES, MOOD_EMOJIS } from '@/data/logData';
