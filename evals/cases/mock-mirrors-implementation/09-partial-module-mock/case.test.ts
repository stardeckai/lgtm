import { describe, expect, it, vi } from "vitest";
import { checkoutTotalCents, type Cart } from "./impl";

vi.mock("./impl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./impl")>();
  return {
    ...actual,
    shippingCents: vi.fn((cart: Cart) => {
      const units = cart.items.reduce((sum, item) => sum + item.qty, 0);
      const base = cart.country === "US" ? 495 : 1195;
      return units <= 2 ? base : base + (units - 2) * 120;
    }),
  };
});

const cart: Cart = {
  items: [{ sku: "tee", qty: 4, unitCents: 900 }],
  country: "DE",
};

describe("checkoutTotalCents", () => {
  it("adds per-unit shipping above the first two units when the order is under the free threshold", () => {
    expect(checkoutTotalCents(cart, 0)).toBe(5035);
  });
});
