import { describe, expect, it } from "vitest";
import { openAccount, withdrawableCents } from "./impl";

function account(overrides: { id: string; balanceCents: number; overdraftLimitCents: number }) {
  return openAccount({ holder: "J. Prasert", ...overrides });
}

describe("withdrawableCents", () => {
  it("includes the agreed overdraft on top of the balance", () => {
    expect(withdrawableCents(account({ id: "sa_1", balanceCents: 12_000, overdraftLimitCents: 5_000 }))).toBe(17_000);
    expect(withdrawableCents(account({ id: "sa_2", balanceCents: -4_000, overdraftLimitCents: 5_000 }))).toBe(1_000);
  });
});
