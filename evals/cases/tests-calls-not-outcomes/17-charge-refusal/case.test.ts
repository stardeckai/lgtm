import { describe, expect, it, vi } from "vitest";
import { checkout, CheckoutError, type Gateway } from "./impl";

describe("checkout", () => {
  it("refuses a cart above the ceiling without touching the gateway", async () => {
    const gateway: Gateway = { charge: vi.fn().mockResolvedValue({ id: "ch_1" }) };

    await expect(
      checkout(gateway, { id: "c-1", totalCents: 500_001, items: 2, customerId: "cus_1" }),
    ).rejects.toThrow(new CheckoutError("amount-too-large"));
    expect(gateway.charge).not.toHaveBeenCalled();
  });
});
