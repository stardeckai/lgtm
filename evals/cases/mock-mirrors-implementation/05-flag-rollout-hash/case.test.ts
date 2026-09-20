import { describe, expect, it } from "vitest";
import { isEnabledFor, type Bucketer, type Flag } from "./impl";

const bucketer: Bucketer = {
  bucketOf(flagKey, userId) {
    let hash = 0x811c9dc5;
    for (const char of `${flagKey}:${userId}`) {
      hash ^= char.charCodeAt(0);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash % 100;
  },
};

const flag: Flag = { key: "new-checkout", rolloutPercent: 25, enabled: true };

describe("isEnabledFor", () => {
  it("keeps the same user on the same side of a 25 percent rollout", () => {
    const first = isEnabledFor(bucketer, flag, "u_20481");
    const second = isEnabledFor(bucketer, flag, "u_20481");

    expect(first).toBe(second);
    expect(isEnabledFor(bucketer, { ...flag, enabled: false }, "u_20481")).toBe(false);
  });
});
