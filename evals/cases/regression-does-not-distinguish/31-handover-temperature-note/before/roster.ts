export type Shift = { staff: string; startHour: number; endHour: number };

export function onDutyAt(shifts: Shift[], hour: number): string[] {
  return shifts
    .filter((s) => hour >= s.startHour && hour < s.endHour)
    .map((s) => s.staff);
}
