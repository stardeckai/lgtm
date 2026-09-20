import { describe, expect, it } from "vitest";
import { nextBillingDate } from "./impl";

describe("nextBillingDate", () => {
  it("clamps a day-31 anchor to the last day of a short month", () => {
    const cycle = { anchorDay: 31, timeZoneOffsetMinutes: 540 };

    expect(nextBillingDate(cycle, "2024-01-31T16:00:00.000Z")).toBe("2024-02-29");
    expect(nextBillingDate(cycle, "2023-01-31T16:00:00.000Z")).toBe("2023-02-28");
    expect(nextBillingDate(cycle, "2024-03-10T00:00:00.000Z")).toBe("2024-03-31");
  });
});
