import { describe, expect, test } from "vitest";
import { Ledger } from "./impl";

describe("Ledger", () => {
  test("refuses a transfer that would overdraw the source account", () => {
    const ledger = new Ledger(new Map([["acc_a", 1000], ["acc_b", 0]]));

    expect(ledger.transfer({ fromId: "acc_a", toId: "acc_b", cents: 2500 })).toEqual({ ok: false });
  });
});
