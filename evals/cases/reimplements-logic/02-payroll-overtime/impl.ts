export type Shift = { day: string; hours: number };

const STANDARD_WEEK_HOURS = 40;

export function weeklyPayCents(shifts: Shift[], baseRateCents: number): number {
  const total = shifts.reduce((sum, shift) => sum + shift.hours, 0);
  const regular = Math.min(total, STANDARD_WEEK_HOURS);
  const overtime = Math.max(0, total - STANDARD_WEEK_HOURS);
  return Math.round(regular * baseRateCents + overtime * baseRateCents * 1.5);
}
