import { describe, expect, it } from "vitest";
import { RateLimiter } from "./impl";

describe("RateLimiter", () => {
  it("starts a fresh allowance once the window has elapsed", () => {
    const limiter = new RateLimiter(5, 60_000);

    expect(limiter.allow("ip-1", 0)).toBe(true);
    expect(limiter.allow("ip-1", 1_000)).toBe(true);
    expect(limiter.allow("ip-1", 90_000)).toBe(true);
  });
});
