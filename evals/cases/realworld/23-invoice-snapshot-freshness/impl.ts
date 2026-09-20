export type QuoteLine = {
  planKey: string;
  quantity: number;
  listCents: number;
  effectiveCents: number;
  savingsCents: number;
  pricingBasis: "standard" | "member";
  discountPlan: string | null;
  reason: string | null;
  snapshotVersion: string;
};

export type QuoteSnapshot = {
  quoteId: string;
  fingerprint: string;
  catalogVersion: string;
  snapshotVersion: string;
  expiresAt: string;
  basis: "authority_quote" | "local_estimate";
  currency: string;
  totalCents: number;
  lines: QuoteLine[];
};

export class StaleQuoteError extends Error {
  constructor(readonly quoteId: string) {
    super(`quote ${quoteId} expired before settlement`);
    this.name = "StaleQuoteError";
  }
}

export function assertQuotesFreshAtSettlement(snapshots: QuoteSnapshot[], now = new Date()): void {
  for (const snapshot of snapshots) {
    if (Date.parse(snapshot.expiresAt) <= now.getTime()) {
      throw new StaleQuoteError(snapshot.quoteId);
    }
  }
}
