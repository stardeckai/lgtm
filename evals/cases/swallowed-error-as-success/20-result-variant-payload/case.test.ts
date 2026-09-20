import { describe, expect, it } from "vitest";
import { withdraw } from "./impl";

describe("withdraw", () => {
  it("reports the exact shortfall when the balance is too low", () => {
    const account = { id: "acc_1", balanceCents: 4_250, frozenSince: null };

    expect(withdraw(account, 10_000)).toEqual({
      ok: false,
      error: { kind: "insufficient_funds", shortfallCents: 5_750 },
    });
    expect(withdraw({ ...account, frozenSince: "2024-02-02" }, 100)).toEqual({
      ok: false,
      error: { kind: "account_frozen", since: "2024-02-02" },
    });
  });
});
