import { describe, expect, it, vi } from "vitest";
import { shippingOptionFor, type GeoLookup } from "./impl";

describe("shippingOptionFor", () => {
  it("falls back to the most expensive zone when the address cannot be located", async () => {
    const lookup: GeoLookup = { locate: vi.fn().mockResolvedValue(null) };

    await expect(shippingOptionFor(lookup, "203.0.113.9")).resolves.toEqual({
      zone: 4,
      freeOverCents: 15000,
      estimateDays: 11,
    });
  });
});
