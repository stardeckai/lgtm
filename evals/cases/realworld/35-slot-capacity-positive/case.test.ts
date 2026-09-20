import { describe, expect, it } from "vitest";
import { ScheduleStore, slotsForDay } from "./impl";

describe("published slot availability", () => {
  it("every published slot key resolves to a positive capacity", () => {
    const store = new ScheduleStore();
    store.setCapacity("0900-1000", 4);

    const slots = slotsForDay(9 * 60, 17 * 60, 60);

    expect(slots.length).toBeGreaterThan(0);
    for (const slot of slots) {
      expect(store.capacityFor(slot.slotKey), `slot ${slot.slotKey}`).toBeGreaterThan(0);
    }
  });
});
