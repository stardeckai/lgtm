import { describe, expect, it } from "vitest";
import { isWithinShift } from "./impl";

describe("isWithinShift", () => {
  it("closes the shift at its end hour rather than one hour later", () => {
    const shift = { startHour: 9, endHour: 17 };

    expect(isWithinShift(shift, Date.UTC(2026, 5, 1, 9, 59), 420)).toBe(true);
    expect(isWithinShift(shift, Date.UTC(2026, 5, 1, 10, 0), 420)).toBe(false);
  });
});
