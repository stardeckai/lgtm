import { describe, expect, it } from "vitest";
import { isOn, type FeatureFlag } from "./impl";

describe("isOn", () => {
  it("includes every user once the rollout is above the bucket range", () => {
    const flag = { key: "new_checkout", enabled: true, rolloutPercent: 250 } as FeatureFlag;

    expect(isOn(flag, "user_a")).toBe(true);
    expect(isOn(flag, "user_b")).toBe(true);
  });
});
