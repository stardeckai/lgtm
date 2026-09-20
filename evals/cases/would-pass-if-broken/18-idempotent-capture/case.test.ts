import { describe, expect, it } from "vitest";
import { PaymentLedger } from "./impl";

describe("PaymentLedger.capture", () => {
  it("captures once when the same idempotency key is replayed", () => {
    const ledger = new PaymentLedger();

    const first = ledger.capture("key-a", "o-1", 2500);
    const replay = ledger.capture("key-a", "o-1", 2500);
    const other = ledger.capture("key-b", "o-2", 700);

    expect(replay.id).toBe(first.id);
    expect(other.id).not.toBe(first.id);
    expect(ledger.all()).toEqual([
      { id: "ch_1", orderId: "o-1", amountCents: 2500 },
      { id: "ch_2", orderId: "o-2", amountCents: 700 },
    ]);
  });
});
