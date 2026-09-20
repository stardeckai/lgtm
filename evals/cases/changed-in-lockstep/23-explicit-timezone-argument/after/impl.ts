export type Shift = { startHour: number; endHour: number };

export function isWithinShift(shift: Shift, epochMs: number, utcOffsetMinutes: number): boolean {
  const hour = new Date(epochMs + utcOffsetMinutes * 60_000).getUTCHours();
  return hour >= shift.startHour && hour < shift.endHour;
}
