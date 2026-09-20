export type Availability = { openMinute: number; closeMinute: number; breakStart: number; breakEnd: number };

export function slotsFor(availability: Availability, durationMinutes: number): { start: number; end: number }[] {
  const slots: { start: number; end: number }[] = [];
  for (let start = availability.openMinute; start + durationMinutes <= availability.closeMinute; start += durationMinutes) {
    const end = start + durationMinutes;
    const overlapsBreak = start < availability.breakEnd && availability.breakStart < end;
    if (!overlapsBreak) slots.push({ start, end });
  }
  return slots;
}
