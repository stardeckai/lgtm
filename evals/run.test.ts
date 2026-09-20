import { describe, expect, it } from "vitest";
import { fitThreshold } from "./run.js";

describe("fitThreshold", () => {
  it("sits one step above the lowest threshold with zero false positives, sacrificing recall", () => {
    // 0.50 would catch both positives but admits both negatives. The first clean point is 0.65 (above the
    // 0.60 negative); with the 0.05 margin the answer is 0.70, and the 0.5 positive is knowingly given up.
    expect(fitThreshold([0.9, 0.5], [0.6, 0.55])).toBe(0.7);
  });

  it("falls back to the most precise point when a negative outscores every positive", () => {
    // No grid point is clean. Precision peaks at 0.75 (3 of 4 positives vs the 0.90 negative) from 0.35
    // through 0.70; the highest such t is 0.70 (ties go up), plus margin = 0.75.
    expect(fitThreshold([0.8, 0.75, 0.7, 0.3], [0.9, 0.3, 0.3, 0.3])).toBe(0.75);
  });

  it("never exceeds the top of the grid", () => {
    expect(fitThreshold([0.97], [0.94])).toBe(0.95);
  });

  it("has nothing to fit without positives", () => {
    expect(fitThreshold([], [0.1, 0.2])).toBeUndefined();
  });
});
