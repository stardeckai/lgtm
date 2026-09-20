export type Shift = { startHour: number; endHour: number };

export function isWithinShift(shift: Shift, epochMs: number): boolean {
  const hour = new Date(epochMs).getUTCHours();
  return hour >= shift.startHour && hour < shift.endHour;
}
