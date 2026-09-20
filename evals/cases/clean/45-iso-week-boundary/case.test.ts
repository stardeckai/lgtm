import { describe, expect, it } from "vitest";
import { weekLabel } from "./impl";

describe("weekLabel", () => {
  it("puts the days around new year in the week their thursday belongs to", () => {
    expect(weekLabel(new Date("2027-01-01T00:00:00Z"))).toBe("2026-W53");
    expect(weekLabel(new Date("2027-01-03T00:00:00Z"))).toBe("2026-W53");
    expect(weekLabel(new Date("2027-01-04T00:00:00Z"))).toBe("2027-W01");
    expect(weekLabel(new Date("2026-12-28T00:00:00Z"))).toBe("2026-W53");
    expect(weekLabel(new Date("2026-06-15T00:00:00Z"))).toBe("2026-W25");
  });
});
