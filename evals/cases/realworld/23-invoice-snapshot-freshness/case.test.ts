import { describe, expect, it } from "vitest";
import { assertQuotesFreshAtSettlement, type QuoteSnapshot } from "./impl";

describe("settlement-boundary freshness gate", () => {
  it("assertQuotesFreshAtSettlement passes when all snapshots are fresh", () => {
    const fresh: QuoteSnapshot = {
      quoteId: "q-fresh",
      fingerprint: "authority-fingerprint-q-fresh",
      catalogVersion: "v1",
      snapshotVersion: "v1",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      basis: "authority_quote",
      currency: "USD",
      totalCents: 25_000,
      lines: [
        {
          planKey: "seat_monthly",
          quantity: 1,
          listCents: 25_000,
          effectiveCents: 25_000,
          savingsCents: 0,
          pricingBasis: "standard",
          discountPlan: null,
          reason: null,
          snapshotVersion: "v1",
        },
        {
          planKey: "seat_monthly_overage",
          quantity: 2,
          listCents: 5_000,
          effectiveCents: 5_000,
          savingsCents: 0,
          pricingBasis: "standard",
          discountPlan: null,
          reason: null,
          snapshotVersion: "v1",
        },
      ],
    };

    expect(() => assertQuotesFreshAtSettlement([fresh])).not.toThrow();
  });
});
