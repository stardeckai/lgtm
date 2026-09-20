import { describe, expect, it } from "vitest";
import { isoWeekNumber } from "./impl";

describe("isoWeekNumber", () => {
  it("puts the turn of the year in the week its Thursday belongs to", () => {
    expect(isoWeekNumber(new Date("2021-01-01T00:00:00Z"))).toBe(53);
    expect(isoWeekNumber(new Date("2021-01-04T00:00:00Z"))).toBe(1);
    expect(isoWeekNumber(new Date("2024-12-30T00:00:00Z"))).toBe(1);
    expect(isoWeekNumber(new Date("2024-06-17T00:00:00Z"))).toBe(25);
  });
});
