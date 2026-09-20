export type Slot = { slotKey: string; startMinute: number; endMinute: number };

const DEFAULT_CAPACITY = 12;

export class ScheduleStore {
  private overrides = new Map<string, number>();

  setCapacity(slotKey: string, capacity: number): void {
    this.overrides.set(slotKey, capacity);
  }

  capacityFor(slotKey: string): number {
    return this.overrides.get(slotKey) ?? DEFAULT_CAPACITY;
  }
}

export function slotsForDay(opensAt: number, closesAt: number, lengthMinutes: number): Slot[] {
  const slots: Slot[] = [];
  for (let start = opensAt; start + lengthMinutes <= closesAt; start += lengthMinutes) {
    const end = start + lengthMinutes;
    const key = `${String(Math.floor(start / 60)).padStart(2, "0")}${String(start % 60).padStart(2, "0")}-${String(Math.floor(end / 60)).padStart(2, "0")}${String(end % 60).padStart(2, "0")}`;
    slots.push({ slotKey: key, startMinute: start, endMinute: end });
  }
  return slots;
}
