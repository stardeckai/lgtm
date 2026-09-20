import { describe, expect, it } from "vitest";
import { parseDuration } from "./impl";

describe("parseDuration", () => {
  it("adds up compound units and rejects anything it did not fully consume", () => {
    expect(parseDuration("1h30m")).toBe(5_400_000);
    expect(parseDuration("250ms")).toBe(250);
    expect(parseDuration("2d0h")).toBe(172_800_000);
    expect(() => parseDuration("10 weeks")).toThrow('cannot parse duration "10 weeks"');
  });
});
