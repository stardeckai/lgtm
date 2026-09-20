import { describe, expect, it } from "vitest";
import { Checkout } from "./impl";

describe("Checkout.submit", () => {
  it("creates the order and charges the card", () => {
    const checkout = new Checkout();

    expect(checkout.submit("key_a", 7_900)).toEqual({ orderId: "ord_1", chargedCents: 7_900 });
    expect(checkout.chargedTotal).toBe(7_900);
  });

  it("returns the first order and charges nothing more for a repeated idempotency key", () => {
    const checkout = new Checkout();
    checkout.submit("key_a", 7_900);

    expect(checkout.submit("key_a", 7_900)).toEqual({ orderId: "ord_1", chargedCents: 7_900 });
    expect(checkout.chargedTotal).toBe(7_900);
  });
});
