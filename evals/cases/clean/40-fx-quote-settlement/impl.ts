export type Quote = { from: string; to: string; rateMicros: number; expiresAtMs: number; quotedMinor: number };

export function quote(from: string, to: string, amountMinor: number, rateMicros: number, nowMs: number): Quote {
  if (amountMinor <= 0) throw new RangeError("amount must be positive");
  return {
    from,
    to,
    rateMicros,
    expiresAtMs: nowMs + 60_000,
    quotedMinor: Math.round((amountMinor * rateMicros) / 1_000_000),
  };
}

export type Settlement = { creditedMinor: number; feeMinor: number } | { error: "quote expired" };

export function settle(q: Quote, nowMs: number, feeBasisPoints: number): Settlement {
  if (nowMs > q.expiresAtMs) return { error: "quote expired" };
  const fee = Math.round((q.quotedMinor * feeBasisPoints) / 10_000);
  return { creditedMinor: q.quotedMinor - fee, feeMinor: fee };
}
