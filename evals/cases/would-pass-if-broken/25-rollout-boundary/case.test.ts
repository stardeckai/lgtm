import { describe, expect, it } from "vitest";
import { inRollout } from "./impl";

describe("inRollout", () => {
  it("includes buckets below the percentage and excludes the one at it", () => {
    const rollout = { percent: 50, overrides: { "u-block": false } };

    expect(inRollout(rollout, "u-1", 49)).toBe(true);
    expect(inRollout(rollout, "u-1", 50)).toBe(false);
    expect(inRollout(rollout, "u-block", 0)).toBe(false);
  });
});
