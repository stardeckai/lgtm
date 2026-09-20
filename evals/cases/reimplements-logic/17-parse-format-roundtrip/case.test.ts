import { describe, expect, it } from "vitest";
import { formatDuration, parseDuration } from "./impl";

describe("duration text", () => {
  it("survives a format then parse round trip and rejects an out-of-range minute", () => {
    const original = { hours: 7, minutes: 5, seconds: 9 };

    expect(formatDuration(original)).toBe("07:05:09");
    expect(parseDuration(formatDuration(original))).toEqual(original);
    expect(() => parseDuration("07:65:09")).toThrow("malformed duration 07:65:09");
  });
});
