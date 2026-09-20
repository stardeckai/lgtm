import { describe, expect, it, vi } from "vitest";
import { postSale, type Ledger } from "./impl";

describe("postSale", () => {
  it("splits the gross between the marketplace fee and the seller payout", () => {
    const ledger: Ledger = { post: vi.fn() };

    postSale(ledger, { id: "s-1", grossCents: 12_345, marketplaceFeeBps: 750, sellerId: "sel-2" });

    expect(ledger.post).toHaveBeenCalledTimes(2);
  });
});
