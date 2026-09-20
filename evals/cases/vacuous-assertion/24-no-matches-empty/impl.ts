export type Shift = { id: string; startMin: number; endMin: number; staffId: string };

export function overlapping(shifts: Shift[], candidate: Shift): Shift[] {
  return shifts.filter(
    (shift) =>
      shift.staffId === candidate.staffId &&
      shift.id !== candidate.id &&
      shift.startMin < candidate.endMin &&
      candidate.startMin < shift.endMin,
  );
}
