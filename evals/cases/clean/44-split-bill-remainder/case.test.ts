import { describe, expect, it } from "vitest";
import { allocate } from "./impl";

describe("allocate", () => {
  it("never loses or invents a cent and gives the odd cents to the largest fractions first", () => {
    expect(allocate(100, [1, 1, 1])).toEqual([34, 33, 33]);
    expect(allocate(1000, [1, 1, 1])).toEqual([334, 333, 333]);
    expect(allocate(500, [3, 1])).toEqual([375, 125]);
    expect(allocate(1, [1, 1])).toEqual([1, 0]);
    expect(allocate(0, [2, 5])).toEqual([0, 0]);
    expect(() => allocate(100, [0, 0])).toThrow(RangeError);
  });
});
