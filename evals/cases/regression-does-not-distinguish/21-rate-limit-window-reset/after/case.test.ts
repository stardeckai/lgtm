import { describe, expect, it } from "vitest";
import { RateLimiter } from "./impl";

describe("RateLimiter", () => {
  it("lets a caller through again once its window has elapsed", () => {
    const limiter = new RateLimiter(2, 60_000);

    expect(limiter.allow("ip-1", 0)).toBe(true);
    expect(limiter.allow("ip-1", 1000)).toBe(true);
    expect(limiter.allow("ip-1", 2000)).toBe(false);
    expect(limiter.allow("ip-1", 61_000)).toBe(true);
  });
});
