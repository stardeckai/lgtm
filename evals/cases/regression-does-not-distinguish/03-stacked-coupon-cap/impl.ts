export type Coupon = { code: string; percentOff: number };

export function priceAfterCoupons(subtotalCents: number, coupons: Coupon[]): number {
  if (coupons.length === 0) return subtotalCents;
  const best = coupons.reduce((a, b) => (b.percentOff > a.percentOff ? b : a));
  return Math.round(subtotalCents * (1 - best.percentOff / 100));
}
