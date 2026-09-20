import { describe, expect, it } from "vitest";
import { isEnabled } from "./impl";

describe("isEnabled", () => {
  it("puts a user inside the rollout percentage into the flag", () => {
    const flag = { key: "new-checkout", rolloutPercent: 100, allowList: ["u-7"] };

    expect(isEnabled(flag, "u-7")).toBe(true);
  });
});
