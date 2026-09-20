export type TimeEntry = { id: string; day: string; minutes: number; billable: boolean };

export class Timesheet {
  private entries: TimeEntry[] = [];

  log(entry: TimeEntry): void {
    if (entry.minutes <= 0) throw new Error("a time entry must be positive");
    if (entry.minutes > 16 * 60) throw new Error("a single entry cannot exceed 16 hours");
    this.entries.push(entry);
  }

  load(entries: TimeEntry[]): void {
    this.entries = [...entries];
  }

  billableHours(): number {
    const minutes = this.entries
      .filter((entry) => entry.billable)
      .reduce((sum, entry) => sum + entry.minutes, 0);
    return Math.round((minutes / 60) * 4) / 4;
  }
}
