import { describe, expect, it, vi } from "vitest";
import { reimbursementUsdCents, type Expense, type RateFeed } from "./impl";

const feed: RateFeed = {
  latest: vi.fn().mockResolvedValue({ EUR: 0.92, GBP: 0.79 }),
};

const expenses: Expense[] = [
  { id: "e-1", currency: "USD", minorUnits: 1200 },
  { id: "e-2", currency: "EUR", minorUnits: 4600 },
  { id: "e-3", currency: "GBP", minorUnits: 1580 },
];

describe("reimbursementUsdCents", () => {
  it("converts every foreign line into dollars and refuses an unquoted currency", async () => {
    await expect(reimbursementUsdCents(feed, expenses)).resolves.toBe(8200);
    await expect(
      reimbursementUsdCents(feed, [{ id: "e-4", currency: "SEK", minorUnits: 100 }]),
    ).rejects.toThrow("no USD rate for SEK");
  });
});
