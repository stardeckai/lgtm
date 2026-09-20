const WEEKEND = new Set([0, 6]);

export function addBusinessDays(startIso: string, days: number, holidays: string[]): string {
  const date = new Date(startIso);
  let left = days;
  while (left > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const iso = date.toISOString().slice(0, 10);
    if (WEEKEND.has(date.getUTCDay()) || holidays.includes(iso)) continue;
    left -= 1;
  }
  return date.toISOString();
}
