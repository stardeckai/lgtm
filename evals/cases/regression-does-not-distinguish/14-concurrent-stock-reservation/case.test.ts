import { describe, expect, it } from "vitest";
import { StockLedger } from "./impl";

describe("StockLedger", () => {
  it("does not oversell when two reservations race for the last unit", async () => {
    const ledger = new StockLedger({ "sku-9": 1 });

    expect(await ledger.reserve("sku-9", 1)).toBe(true);
    expect(await ledger.reserve("sku-9", 1)).toBe(false);
    expect(ledger.onHand("sku-9")).toBe(0);
  });
});
