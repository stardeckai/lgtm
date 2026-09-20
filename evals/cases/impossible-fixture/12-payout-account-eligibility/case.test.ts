import { describe, expect, it } from "vitest";
import { nextPayoutCents, type PayoutAccount } from "./impl";

function account(overrides: Partial<PayoutAccount>): PayoutAccount {
  return {
    id: "acct_2",
    country: "SG",
    verified: true,
    payoutsEnabled: false,
    balanceCents: 0,
    ...overrides,
  } as PayoutAccount;
}

describe("nextPayoutCents", () => {
  it("holds the money back for a verified account", () => {
    expect(nextPayoutCents(account({ balanceCents: 9500 }), 5000)).toBe(0);
  });
});
