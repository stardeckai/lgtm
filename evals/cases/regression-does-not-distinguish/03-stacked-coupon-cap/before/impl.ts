export type Coupon = { code: string; percentOff: number };

export function priceAfterCoupons(subtotalCents: number, coupons: Coupon[]): number {
  let total = subtotalCents;
  for (const coupon of coupons) {
    total = Math.round(total * (1 - coupon.percentOff / 100));
  }
  return total;
}
