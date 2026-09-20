export type Payout = { sellerId: string; grossCents: number; feeRate: number };

export function netPayoutCents(payout: Payout): number {
  const fee = Math.floor(payout.grossCents * payout.feeRate);
  return payout.grossCents - fee;
}
