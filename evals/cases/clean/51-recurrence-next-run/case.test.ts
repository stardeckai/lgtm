import { describe, expect, it } from "vitest";
import { nextRunUtc, type OffsetRule, type Recurrence } from "./impl";

describe("nextRunUtc", () => {
  it("keeps a nine o'clock local job at nine local across the offset change", () => {
    const rules: OffsetRule[] = [
      { fromUtcMs: Date.UTC(2026, 0, 1), offsetMinutes: 60 },
      { fromUtcMs: Date.UTC(2026, 2, 29, 1, 0), offsetMinutes: 120 },
    ];
    const weekly: Recurrence = { localHour: 9, localMinute: 0, weekdays: [1, 2, 3, 4, 5] };

    expect(nextRunUtc(weekly, rules, Date.UTC(2026, 2, 26, 12, 0))).toBe(Date.UTC(2026, 2, 27, 8, 0));
    expect(nextRunUtc(weekly, rules, Date.UTC(2026, 2, 27, 12, 0))).toBe(Date.UTC(2026, 2, 30, 7, 0));
    expect(nextRunUtc(weekly, rules, Date.UTC(2026, 2, 30, 12, 0))).toBe(Date.UTC(2026, 2, 31, 7, 0));
  });
});
