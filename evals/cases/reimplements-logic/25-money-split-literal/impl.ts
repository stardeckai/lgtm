export type Refund = { chargeCents: number; feeCents: number; refundCents: number };

export type RefundBreakdown = { toCustomerCents: number; feeReturnedCents: number; netCents: number };

export function refundBreakdown(refund: Refund): RefundBreakdown {
  if (refund.refundCents > refund.chargeCents) throw new RangeError("refund exceeds charge");
  const proportion = refund.refundCents / refund.chargeCents;
  const feeReturnedCents = Math.floor(refund.feeCents * proportion);
  return {
    toCustomerCents: refund.refundCents,
    feeReturnedCents,
    netCents: refund.chargeCents - refund.feeCents - refund.refundCents + feeReturnedCents,
  };
}
