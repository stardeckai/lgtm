import { describe, expect, it } from "vitest";
import { nextRunAt, type Schedule } from "./impl";

describe("nextRunAt", () => {
  it("returns the first slot strictly after the given instant", () => {
    const schedule: Schedule = {
      startIso: "2024-06-03T06:00:00.000Z",
      everyMinutes: 90,
      skipWeekends: false,
    };
    const after = "2024-06-03T10:14:00.000Z";

    const stepMs = schedule.everyMinutes * 60_000;
    const steps = Math.ceil((Date.parse(after) - Date.parse(schedule.startIso)) / stepMs);
    let expected = new Date(Date.parse(schedule.startIso) + steps * stepMs);
    if (expected.getTime() <= Date.parse(after)) {
      expected = new Date(expected.getTime() + stepMs);
    }

    expect(nextRunAt(schedule, after)).toBe(expected.toISOString());
  });
});
