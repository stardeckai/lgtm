import { describe, expect, it, vi } from "vitest";
import { recordPayout, type Clock, type FxSource, type LedgerRepository } from "./impl";

const fx: FxSource = { rate: vi.fn().mockResolvedValue(1.1) };
const clock: Clock = { nowIso: vi.fn().mockReturnValue("2024-08-01T00:00:00.000Z") };

describe("recordPayout", () => {
  it("leaves the payable and cash accounts balanced after the posting", async () => {
    const ledger: LedgerRepository = {
      post: vi.fn().mockResolvedValue(undefined),
      balance: vi.fn().mockResolvedValue(0),
    };

    await recordPayout(ledger, fx, clock, { id: "po_3", currency: "EUR", minorUnits: 10_000 });

    await expect(ledger.balance("payouts_payable")).resolves.toBe(0);
    await expect(ledger.balance("cash")).resolves.toBe(0);
  });
});
