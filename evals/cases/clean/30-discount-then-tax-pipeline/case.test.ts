import { describe, expect, it } from "vitest";
import { price, type Basket, type Promotion } from "./impl";

describe("price", () => {
  it("taxes the discounted subtotal and charges no discount below the promotion threshold", () => {
    const basket: Basket = { items: [{ sku: "A", cents: 6000 }, { sku: "B", cents: 4000 }] };
    const promotion: Promotion = { code: "TEN", kind: "percent", amount: 10, minSubtotalCents: 5000 };

    expect(price(basket, promotion, 200)).toEqual({
      subtotalCents: 10000,
      discountCents: 1000,
      taxCents: 1800,
      totalCents: 10800,
      promotionApplied: true,
    });
    expect(price({ items: [{ sku: "A", cents: 4000 }] }, promotion, 200)).toEqual({
      subtotalCents: 4000,
      discountCents: 0,
      taxCents: 800,
      totalCents: 4800,
      promotionApplied: false,
    });
  });
});
