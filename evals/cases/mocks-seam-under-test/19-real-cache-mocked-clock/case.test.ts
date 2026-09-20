import { describe, expect, it, vi } from "vitest";
import { memoize, TtlCache } from "./impl";

describe("memoize", () => {
  it("reloads once the entry has passed its ttl and evicts the stale key", async () => {
    let nowMs = 1_000;
    const cache = new TtlCache<string>(() => nowMs);
    const load = vi.fn().mockResolvedValueOnce("first").mockResolvedValueOnce("second");

    expect(await memoize(cache, "org:1", 5_000, load)).toBe("first");
    nowMs = 4_000;
    expect(await memoize(cache, "org:1", 5_000, load)).toBe("first");
    nowMs = 6_001;
    expect(await memoize(cache, "org:1", 5_000, load)).toBe("second");
    expect(load).toHaveBeenCalledTimes(2);
    expect(cache.size).toBe(1);
  });
});
