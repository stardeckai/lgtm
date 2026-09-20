export type Merchant = { id: string; payoutCurrency: string; feeBps: number; holdDays: number };
export type Transfer = { merchantId: string; grossCents: number; capturedAt: string };

export type Batch = { currency: string; transfers: Transfer[]; netCents: number };

export function buildBatch(merchants: Merchant[], transfers: Transfer[], merchantId: string): Batch {
  const merchant = merchants.find((m) => m.id === merchantId);
  if (!merchant) throw new Error(`unknown merchant ${merchantId}`);
  const mine = transfers.filter((t) => t.merchantId === merchantId);
  const gross = mine.reduce((sum, t) => sum + t.grossCents, 0);
  const fee = Math.round((gross * merchant.feeBps) / 10_000);
  return { currency: merchant.payoutCurrency, transfers: mine, netCents: gross - fee };
}
