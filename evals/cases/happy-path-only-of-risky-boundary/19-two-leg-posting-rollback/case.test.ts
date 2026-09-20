import { describe, expect, it } from "vitest";
import { Bank } from "./impl";

function bank(): Bank {
  return new Bank([
    { id: "a", balanceCents: 5_000, frozen: false },
    { id: "b", balanceCents: 0, frozen: false },
    { id: "frozen", balanceCents: 0, frozen: true },
  ]);
}

describe("Bank.post", () => {
  it("debits the sender and credits the receiver", () => {
    const ledger = bank();

    ledger.post("a", "b", 1_500);

    expect(ledger.find("a").balanceCents).toBe(3_500);
    expect(ledger.find("b").balanceCents).toBe(1_500);
  });

  it("rolls the debit back when the credit leg fails", () => {
    const ledger = bank();

    expect(() => ledger.post("a", "frozen", 1_500)).toThrow("destination account is frozen");
    expect(ledger.find("a").balanceCents).toBe(5_000);
  });
});
