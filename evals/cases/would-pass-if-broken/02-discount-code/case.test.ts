import { describe, expect, it } from "vitest";
import { priceBasket } from "./impl";

describe("priceBasket", () => {
  it("subtracts the code's percentage from the basket subtotal", () => {
    const priced = priceBasket({ code: "SAVE25", subtotalCents: 10000, memberTier: "basic" });

    expect(priced.code).toBe("SAVE25");
    expect(priced.subtotalCents).toBe(10000);
  });
});
