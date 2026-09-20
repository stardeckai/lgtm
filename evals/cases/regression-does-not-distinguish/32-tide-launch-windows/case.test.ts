import { describe, expect, it } from "vitest";
import { launchWindows, type Tide } from "./impl";

const day: Tide[] = [
  { hour: 0, metres: 0.8 },
  { hour: 1, metres: 1.2 },
  { hour: 2, metres: 1.5 },
  { hour: 3, metres: 1.1 },
  { hour: 4, metres: 0.6 },
  { hour: 5, metres: 1.4 },
  { hour: 6, metres: 1.6 },
  { hour: 7, metres: 0.9 },
];

describe("launchWindows", () => {
  it("groups the contiguous hours the slipway is deep enough into closed windows", () => {
    expect(launchWindows(day, 1)).toEqual([
      [1, 3],
      [5, 6],
    ]);
    expect(launchWindows(day, 2)).toEqual([]);
  });
});
