export type Shift = { startedAt: string; minutes: number };

export type Pay = { regularMinutes: number; overtimeMinutes: number };

const WEEK_START_DAY = 1;
const REGULAR_WEEK_MINUTES = 40 * 60;

function weekKey(iso: string): string {
  const date = new Date(iso);
  const offset = (date.getUTCDay() - WEEK_START_DAY + 7) % 7;
  const monday = new Date(date.getTime() - offset * 86_400_000);
  return monday.toISOString().slice(0, 10);
}

export function splitOvertime(shifts: Shift[]): Record<string, Pay> {
  const byWeek: Record<string, number> = {};
  for (const shift of shifts) {
    const key = weekKey(shift.startedAt);
    byWeek[key] = (byWeek[key] ?? 0) + shift.minutes;
  }
  const out: Record<string, Pay> = {};
  for (const [key, minutes] of Object.entries(byWeek)) {
    out[key] = {
      regularMinutes: Math.min(minutes, REGULAR_WEEK_MINUTES),
      overtimeMinutes: Math.max(0, minutes - REGULAR_WEEK_MINUTES),
    };
  }
  return out;
}
