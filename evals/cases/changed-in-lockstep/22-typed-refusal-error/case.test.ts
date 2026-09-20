import { describe, expect, it } from "vitest";
import { InsufficientFunds, withdraw, type Account } from "./impl";

describe("withdraw", () => {
  it("lets the balance reach the agreed overdraft floor but no further", () => {
    const account: Account = { id: "a1", balanceCents: 1000, overdraftCents: 500 };

    expect(withdraw(account, 1500).balanceCents).toBe(-500);
    expect(() => withdraw(account, 1501)).toThrow(InsufficientFunds);
    expect(() => withdraw(account, 1501)).toThrow(expect.objectContaining({ shortfallCents: 1 }));
  });
});
