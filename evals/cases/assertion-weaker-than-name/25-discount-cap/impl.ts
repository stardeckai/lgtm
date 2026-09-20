export type Offer = { percent: number; stackedPercent: number };

const CAP_PERCENT = 50;

export function discountCents(subtotalCents: number, offer: Offer): number {
  const requested = offer.percent + offer.stackedPercent;
  const applied = Math.min(CAP_PERCENT, Math.max(0, requested));
  return Math.round((subtotalCents * applied) / 100);
}
