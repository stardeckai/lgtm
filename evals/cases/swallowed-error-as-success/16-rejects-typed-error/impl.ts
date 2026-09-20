export class ValidationError extends Error {
  constructor(
    readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export type Coupon = { code: string; expiresAt: string; minSpendCents: number };

export function applyCoupon(coupon: Coupon, subtotalCents: number, nowIso: string): number {
  if (Date.parse(coupon.expiresAt) < Date.parse(nowIso)) {
    throw new ValidationError("code", `coupon ${coupon.code} expired on ${coupon.expiresAt}`);
  }
  if (subtotalCents < coupon.minSpendCents) {
    throw new ValidationError("subtotal", `spend at least ${coupon.minSpendCents} cents to use ${coupon.code}`);
  }
  return Math.round(subtotalCents * 0.9);
}
