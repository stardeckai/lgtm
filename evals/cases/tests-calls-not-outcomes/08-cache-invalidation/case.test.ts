import { describe, expect, it, vi } from "vitest";
import { invalidatePrices, type Cache } from "./impl";

describe("invalidatePrices", () => {
  it("clears every channel cache key for the org", async () => {
    const cache: Cache = { del: vi.fn().mockResolvedValue(undefined) };

    await invalidatePrices(cache, { orgId: "org-4", sku: "sku-9", channel: "all" });

    expect(cache.del).toHaveBeenCalled();
  });
});
