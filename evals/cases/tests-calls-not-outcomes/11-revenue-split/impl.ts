export type Sale = { id: string; grossCents: number; marketplaceFeeBps: number; sellerId: string };

export interface Ledger {
  post(entry: { account: string; cents: number; ref: string }): void;
}

export function postSale(ledger: Ledger, sale: Sale): { fee: number; payout: number } {
  const fee = Math.floor((sale.grossCents * sale.marketplaceFeeBps) / 10_000);
  const payout = sale.grossCents - fee;
  ledger.post({ account: "platform:fees", cents: fee, ref: sale.id });
  ledger.post({ account: `seller:${sale.sellerId}`, cents: payout, ref: sale.id });
  return { fee, payout };
}
