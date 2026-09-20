export type Shift = { staffId: string; startMinute: number; endMinute: number };

export class Roster {
  private shifts: Shift[] = [];

  assign(shift: Shift): Shift {
    if (shift.endMinute <= shift.startMinute) throw new Error("a shift must end after it starts");
    if (shift.endMinute - shift.startMinute > 12 * 60) throw new Error("a shift cannot exceed 12 hours");
    const clash = this.shifts.some(
      (existing) =>
        existing.staffId === shift.staffId &&
        shift.startMinute < existing.endMinute &&
        existing.startMinute < shift.endMinute,
    );
    if (clash) throw new Error("staff member is already on a shift then");
    this.shifts.push(shift);
    return shift;
  }

  hoursFor(staffId: string): number {
    const minutes = this.shifts
      .filter((shift) => shift.staffId === staffId)
      .reduce((sum, shift) => sum + (shift.endMinute - shift.startMinute), 0);
    return minutes / 60;
  }
}
