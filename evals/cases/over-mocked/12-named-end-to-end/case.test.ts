import { describe, expect, it, vi } from "vitest";
import { checkoutFlow } from "./impl";

vi.mock("./session", () => ({ getSession: vi.fn().mockResolvedValue({ userId: "u-1" }) }));
vi.mock("./db", () => ({
  db: {
    cart: vi.fn().mockResolvedValue({ id: "c-1", ownerId: "u-1", totalCents: 9_900 }),
    createOrder: vi.fn().mockResolvedValue({ id: "o-1", status: "paid" }),
  },
}));

describe("checkout end to end", () => {
  it("takes a cart all the way to a paid order", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ id: "ch_1", status: "paid" }) }),
    );

    const result = await checkoutFlow({ cartId: "c-1", paymentMethodId: "pm_1" });

    expect(result).toEqual({ orderId: "o-1", status: "paid" });
  });
});
