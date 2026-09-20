import { describe, expect, it } from "vitest";
import { PromoService } from "./impl";

describe("PromoService.apply", () => {
  it("applies the code and reports the uses left", () => {
    const promos = new PromoService(2);

    expect(promos.apply("WELCOME", "cus_1", 1_000)).toBe(1);
    expect(promos.apply("WELCOME", "cus_1", 2_000)).toBe(0);
  });

  it("throws when the promo code was already redeemed by this customer", () => {
    const promos = new PromoService(1);
    promos.apply("WELCOME", "cus_1", 1_000);

    expect(() => promos.apply("WELCOME", "cus_1", 2_000)).toThrow("already redeemed by this customer");
  });

  it("counts each customer's uses separately", () => {
    const promos = new PromoService(1);
    promos.apply("WELCOME", "cus_1", 1_000);

    expect(promos.apply("WELCOME", "cus_2", 1_000)).toBe(0);
  });
});
