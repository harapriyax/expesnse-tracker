import { format, subDays, isSameDay, parseISO } from 'date-fns';

export function calculateStreak(completionDates) {
  if (!completionDates || completionDates.length === 0) return 0;

  const sorted = [...completionDates]
    .map(d => (typeof d === 'string' ? parseISO(d) : d))
    .sort((a, b) => b - a);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = subDays(today, 1);

  const mostRecent = new Date(sorted[0]);
  mostRecent.setHours(0, 0, 0, 0);

  if (!isSameDay(mostRecent, today) && !isSameDay(mostRecent, yesterday)) {
    return 0;
  }

  let streak = 1;
  let currentDate = mostRecent;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = subDays(currentDate, 1);
    const checkDate = new Date(sorted[i]);
    checkDate.setHours(0, 0, 0, 0);

    if (isSameDay(checkDate, prevDate)) {
      streak++;
      currentDate = checkDate;
    } else if (!isSameDay(checkDate, currentDate)) {
      break;
    }
  }

  return streak;
}

export function getDateKey(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}

export function isCompletedToday(completionDates) {
  if (!completionDates || completionDates.length === 0) return false;
  const todayKey = getDateKey();
  return completionDates.includes(todayKey);
}

export function getLongestStreak(completionDates) {
  if (!completionDates || completionDates.length === 0) return 0;

  const sorted = [...new Set(completionDates)]
    .map(d => (typeof d === 'string' ? parseISO(d) : d))
    .sort((a, b) => a - b);

  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
    if (Math.round(diff) === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (Math.round(diff) > 1) {
      current = 1;
    }
  }

  return longest;
}
