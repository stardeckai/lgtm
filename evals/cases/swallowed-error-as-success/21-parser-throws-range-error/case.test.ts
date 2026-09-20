import { describe, expect, it } from "vitest";
import { parseDuration } from "./impl";

describe("parseDuration", () => {
  it.each([
    { input: "2:60", message: 'cannot read "2:60" as hh:mm' },
    { input: "2:5", message: 'cannot read "2:5" as hh:mm' },
    { input: "-1:30", message: 'cannot read "-1:30" as hh:mm' },
    { input: "200:00", message: "durations over one week are not supported" },
  ])("rejects $input with a range error rather than coercing it", ({ input, message }) => {
    expect(() => parseDuration(input)).toThrow(new RangeError(message));
    expect(parseDuration("2:59")).toEqual({ hours: 2, minutes: 59 });
  });
});
