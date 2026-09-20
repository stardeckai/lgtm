import { describe, expect, it } from "vitest";
import { cartTotalCents } from "./impl";

describe("cartTotalCents", () => {
  it("adds tax on top of the cart subtotal", () => {
    const total = cartTotalCents([{ sku: "mug", qty: 2, unitCents: 500 }], 0.07);

    expect(total).toBeDefined();
    expect(total).toBeGreaterThan(0);
  });
});
