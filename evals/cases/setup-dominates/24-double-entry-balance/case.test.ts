import { describe, expect, it } from "vitest";
import { Ledger } from "./impl";

describe("Ledger", () => {
  it("rejects an unbalanced transaction without leaving a partial posting behind", () => {
    const ledger = new Ledger();
    ledger.post([
      { account: "cash", debitCents: 120_00, creditCents: 0 },
      { account: "revenue", debitCents: 0, creditCents: 120_00 },
    ]);

    expect(() =>
      ledger.post([
        { account: "cash", debitCents: 50_00, creditCents: 0 },
        { account: "revenue", debitCents: 0, creditCents: 40_00 },
      ]),
    ).toThrow("unbalanced transaction: 5000 vs 4000");

    expect(ledger.balance("cash")).toBe(120_00);
    expect(ledger.balance("revenue")).toBe(-120_00);
  });
});
