export class PricingClientError extends Error {
  constructor(
    message: string,
    readonly category: "unavailable" | "forbidden" | "invalid",
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "PricingClientError";
  }
}

export type QuoteResponse = {
  quoteId: string;
  planKey: string;
  totalCents: number;
  expiresAt: string;
};

export type QuoteSnapshot = QuoteResponse & { capturedAt: string };

export function snapshotFromQuoteResponse(response: QuoteResponse, now: Date): QuoteSnapshot {
  return { ...response, capturedAt: now.toISOString() };
}

export function quoteDisplayState(snapshot: QuoteSnapshot, now: Date): "fresh" | "expired" {
  return Date.parse(snapshot.expiresAt) > now.getTime() ? "fresh" : "expired";
}
