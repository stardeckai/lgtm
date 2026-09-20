import { describe, expect, it, jest } from "@jest/globals";
import { trackCheckoutCompleted, type Analytics } from "./impl";

describe("trackCheckoutCompleted", () => {
  it("emits checkout_completed with the item count, revenue and coupon flag", () => {
    const analytics: Analytics = { track: jest.fn() };

    trackCheckoutCompleted(
      analytics,
      {
        id: "cart-3",
        items: [
          { sku: "a", qty: 2, unitCents: 500 },
          { sku: "b", qty: 1, unitCents: 1_200 },
        ],
        couponCode: null,
      },
      2_200,
    );

    expect(analytics.track).toHaveBeenCalledWith("checkout_completed", {
      cart_id: "cart-3",
      item_count: 3,
      revenue_cents: 2_200,
      coupon_used: false,
    });
  });
});
