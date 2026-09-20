import { describe, expect, it } from "vitest";
import { bandwidthCostCents, PLANS } from "./impl";

describe("bandwidthCostCents", () => {
  it("bills whole gigabytes over the plan allowance", () => {
    const bytes = 147.4 * 1024 * 1024 * 1024;
    const bucket = PLANS.starter!;

    const usedGb = Math.ceil(bytes / (1024 * 1024 * 1024));
    const expected = Math.max(0, usedGb - bucket.includedGb) * bucket.overageCentsPerGb;

    expect(bandwidthCostCents("starter", bytes)).toBe(expected);
  });
});
