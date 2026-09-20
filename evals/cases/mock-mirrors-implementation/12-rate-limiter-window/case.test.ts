import { describe, expect, it } from "vitest";
import { checkLimit, type WindowCounter } from "./impl";

const windows = new Map<string, { count: number; windowStartMs: number }>();

const counter: WindowCounter = {
  hit(key, nowMs, windowMs) {
    const current = windows.get(key);
    if (!current || nowMs - current.windowStartMs >= windowMs) {
      const fresh = { count: 1, windowStartMs: nowMs - (nowMs % windowMs) };
      windows.set(key, fresh);
      return fresh;
    }
    current.count += 1;
    return current;
  },
};

describe("checkLimit", () => {
  it("refuses the fourth call in a minute and reports the wait to the window edge", () => {
    for (let i = 0; i < 3; i += 1) {
      checkLimit(counter, "ip:1.2.3.4", 1_700_000_012_000, 3, 60_000);
    }

    expect(checkLimit(counter, "ip:1.2.3.4", 1_700_000_012_000, 3, 60_000)).toEqual({
      allowed: false,
      remaining: 0,
      retryAfterMs: 28_000,
    });
  });
});
