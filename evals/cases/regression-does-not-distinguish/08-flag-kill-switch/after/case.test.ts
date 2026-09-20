import { describe, expect, it } from "vitest";
import { isEnabled } from "./impl";

describe("isEnabled", () => {
  it("keeps the flag off for everyone once it is killed", () => {
    const flag = { key: "checkout-v2", rolloutPercent: 100, killed: false };

    expect(isEnabled(flag, "u-1")).toBe(true);
    expect(isEnabled({ ...flag, rolloutPercent: 0 }, "u-1")).toBe(false);
  });
});
