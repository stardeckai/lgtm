import { describe, expect, it } from "vitest";
import { transfer, type Wallet } from "./impl";

describe("transfer", () => {
  it("refuses to move minor units between wallets of different currencies", () => {
    const usd: Wallet = { id: "w1", currency: "USD", balanceMinor: 10_000 };
    const eur: Wallet = { id: "w2", currency: "EUR", balanceMinor: 0 };

    expect(() => transfer(usd, eur, 2500)).toThrow(TypeError);
    expect(transfer(usd, { ...eur, currency: "USD" }, 2500).map((w) => w.balanceMinor)).toEqual([7500, 2500]);
  });
});
