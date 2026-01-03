// Get today's date as ISO string (YYYY-MM-DD)
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

// Get yesterday's date as ISO string
export function getYesterdayISO(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

// Parse ISO date string to Date object
export function parseISO(dateStr: string): Date {
  return new Date(dateStr + 'T00:00:00');
}

// Calculate days between two ISO date strings
export function daysBetween(startDate: string, endDate: string): number {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Check if a date is today
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

// Check if a date is yesterday
export function isYesterday(dateStr: string): boolean {
  return dateStr === getYesterdayISO();
}

// Format date for display (e.g., "01/03/2025")
export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Format date as day of week (e.g., "Monday")
export function getDayOfWeek(dateStr: string): string {
  const date = parseISO(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

// Get the current day number in the challenge (1-75)
export function getChallengeDay(startDate: string): number {
  const today = getTodayISO();
  return daysBetween(startDate, today) + 1;
}
