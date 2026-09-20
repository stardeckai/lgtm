import { describe, expect, it } from "vitest";
import { rollingAverage, type Reading } from "./impl";

const readings: Reading[] = Array.from({ length: 6 }, (_, minute) => ({
  minute,
  celsius: [20, 22, 24, 30, 18, 18][minute]!,
}));

describe("rollingAverage", () => {
  it("emits one average per full window and drops the value leaving the window", () => {
    expect(rollingAverage(readings, 3)).toEqual([22, 25.33, 24, 22]);
  });
});
