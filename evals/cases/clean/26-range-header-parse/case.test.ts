import { describe, expect, it } from "vitest";
import { parseRange } from "./impl";

describe("parseRange", () => {
  it("clamps an open ended range and reads a suffix range from the end of the file", () => {
    expect(parseRange("bytes=0-99", 1000)).toEqual([{ start: 0, end: 99 }]);
    expect(parseRange("bytes=900-", 1000)).toEqual([{ start: 900, end: 999 }]);
    expect(parseRange("bytes=-100", 1000)).toEqual([{ start: 900, end: 999 }]);
    expect(parseRange("bytes=0-5000", 1000)).toEqual([{ start: 0, end: 999 }]);
    expect(parseRange("bytes=1000-", 1000)).toBe("unsatisfiable");
    expect(parseRange("items=0-99", 1000)).toBeNull();
  });
});
