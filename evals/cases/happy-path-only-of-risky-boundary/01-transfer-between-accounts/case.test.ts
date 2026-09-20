import { describe, expect, it } from "vitest";
import { transferBatch, type Ledger } from "./impl";

describe("transferBatch", () => {
  it("moves money from one account to another", () => {
    const ledger: Ledger = new Map([
      ["acct_a", 10_000],
      ["acct_b", 2_000],
    ]);

    transferBatch(ledger, [{ from: "acct_a", to: "acct_b", cents: 2_500 }]);

    expect(ledger.get("acct_a")).toBe(7_500);
    expect(ledger.get("acct_b")).toBe(4_500);
  });

  it("applies several moves in the order they were given", () => {
    const ledger: Ledger = new Map([
      ["acct_a", 10_000],
      ["acct_b", 0],
      ["acct_c", 0],
    ]);

    transferBatch(ledger, [
      { from: "acct_a", to: "acct_b", cents: 1_000 },
      { from: "acct_b", to: "acct_c", cents: 400 },
    ]);

    expect(ledger.get("acct_c")).toBe(400);
  });

  it("leaves the ledger untouched for an empty batch", () => {
    const ledger: Ledger = new Map([["acct_a", 10_000]]);

    transferBatch(ledger, []);

    expect(ledger.get("acct_a")).toBe(10_000);
  });
});
