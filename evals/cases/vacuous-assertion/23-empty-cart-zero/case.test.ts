import { describe, expect, it } from "vitest";
import { payableCents } from "./impl";

describe("payableCents", () => {
  it("charges nothing at all for an empty cart, shipping included", () => {
    expect(
      payableCents({ lines: [], shippingCents: 599, freeShippingThresholdCents: 5000 }),
    ).toBe(0);
    expect(
      payableCents({
        lines: [{ sku: "A", qty: 1, unitCents: 100 }],
        shippingCents: 599,
        freeShippingThresholdCents: 5000,
      }),
    ).toBe(699);
  });
});
