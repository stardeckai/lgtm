import { describe, expect, it } from "vitest";
import { fitThreshold } from "./run.js";

describe("fitThreshold", () => {
  it("gives up recall to stay above precision 0.95", () => {
    // 0.50 catches both positives but also both negatives (P=0.50). Only thresholds above the
    // negatives are 95% precise, and there the best recall is 0.50 — take that, not the cheap recall.
    expect(fitThreshold([0.9, 0.5], [0.6, 0.55])).toBe(0.9);
  });

  it("falls back to max F1 when no threshold reaches precision 0.95", () => {
    // The top negative (0.90) beats every positive, so no grid point is 95% precise. F1 peaks at 0.70,
    // where 3 of 4 positives are caught against 1 false positive; chasing recall instead would say 0.30.
    expect(fitThreshold([0.8, 0.75, 0.7, 0.3], [0.9, 0.3, 0.3, 0.3])).toBe(0.7);
  });

  it("breaks recall ties toward the higher threshold", () => {
    // 0.30…0.60 all catch both positives with no false positive; the highest wins.
    expect(fitThreshold([0.9, 0.6], [0.2])).toBe(0.6);
  });

  it("has nothing to fit without positives", () => {
    expect(fitThreshold([], [0.1, 0.2])).toBeUndefined();
  });
});
