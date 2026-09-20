import { describe, expect, test } from "vitest";
import { splitOvertime, type Shift } from "./impl";

describe("splitOvertime", () => {
  test("counts a Sunday shift against the week that started the previous Monday", () => {
    const shifts: Shift[] = [
      { startedAt: "2024-06-03T08:00:00.000Z", minutes: 600 },
      { startedAt: "2024-06-05T08:00:00.000Z", minutes: 600 },
      { startedAt: "2024-06-07T08:00:00.000Z", minutes: 600 },
      { startedAt: "2024-06-09T08:00:00.000Z", minutes: 600 },
      { startedAt: "2024-06-10T08:00:00.000Z", minutes: 480 },
    ];

    expect(splitOvertime(shifts)).toEqual({
      "2024-06-03": { regularMinutes: 2400, overtimeMinutes: 0 },
      "2024-06-10": { regularMinutes: 480, overtimeMinutes: 0 },
    });
  });
});
