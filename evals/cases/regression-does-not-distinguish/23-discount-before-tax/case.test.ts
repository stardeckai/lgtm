import { describe, expect, it } from "vitest";
import { totalCents } from "./impl";

describe("totalCents", () => {
  it("taxes the discounted subtotal, not the full one", () => {
    expect(totalCents({ subtotalCents: 10000, discountCents: 2000, taxRate: 0.2 })).toBe(9600);
    expect(totalCents({ subtotalCents: 10000, discountCents: 0, taxRate: 0.2 })).toBe(12000);
  });
});
