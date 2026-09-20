import { describe, expect, it } from "vitest";
import { formatDuration, parseDuration } from "./impl";

describe("parseDuration", () => {
  it("adds compound units, keeps ms distinct from m and refuses trailing junk", () => {
    expect(parseDuration("1h30m")).toBe(5_400_000);
    expect(parseDuration("500ms")).toBe(500);
    expect(parseDuration("2d")).toBe(172_800_000);
    expect(parseDuration("1m500ms")).toBe(60_500);
    expect(formatDuration(5_400_000)).toBe("1h30m");
    expect(formatDuration(60_500)).toBe("1m500ms");
    expect(() => parseDuration("1h 30x")).toThrow(SyntaxError);
    expect(() => parseDuration("")).toThrow(SyntaxError);
  });
});
