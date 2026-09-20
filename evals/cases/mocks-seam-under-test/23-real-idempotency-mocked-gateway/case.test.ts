import { describe, expect, it, vi } from "vitest";
import { chargeOnce, IdempotencyLog, type PaymentGateway } from "./impl";

describe("chargeOnce", () => {
  it("charges the card once when the same idempotency key is replayed", async () => {
    const log = new IdempotencyLog();
    const gateway: PaymentGateway = {
      charge: vi.fn().mockResolvedValueOnce({ id: "ch_1" }).mockResolvedValueOnce({ id: "ch_2" }),
    };

    const first = await chargeOnce(log, gateway, "key_a", 2500);
    const second = await chargeOnce(log, gateway, "key_a", 2500);

    expect(first).toEqual({ id: "ch_1", amountCents: 2500 });
    expect(second).toEqual({ id: "ch_1", amountCents: 2500 });
    expect(gateway.charge).toHaveBeenCalledTimes(1);
  });
});
