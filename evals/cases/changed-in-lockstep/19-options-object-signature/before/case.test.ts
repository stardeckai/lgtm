import { describe, expect, it } from "vitest";
import { overlaps, type Booking } from "./impl";

const at = (hour: number, minute: number) => Date.UTC(2026, 3, 1, hour, minute);

describe("overlaps", () => {
  it("treats back to back bookings as clashing once a turnaround buffer is required", () => {
    const morning: Booking = { start: at(9, 0), end: at(10, 0) };
    const later: Booking = { start: at(10, 10), end: at(11, 0) };

    expect(overlaps(morning, later, 0)).toBe(false);
    expect(overlaps(morning, later, 15)).toBe(true);
  });
});
