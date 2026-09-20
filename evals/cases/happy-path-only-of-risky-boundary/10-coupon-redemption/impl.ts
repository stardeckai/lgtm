export type Coupon = { code: string; percentOff: number; expiresAtMs: number; oncePerCustomer: boolean };

export class RedemptionLedger {
  private redemptions: { code: string; customerId: string }[] = [];

  redeem(coupon: Coupon, customerId: string, nowMs: number, subtotalCents: number): number {
    if (nowMs > coupon.expiresAtMs) throw new Error("coupon expired");
    if (
      coupon.oncePerCustomer &&
      this.redemptions.some((r) => r.code === coupon.code && r.customerId === customerId)
    ) {
      throw new Error("coupon already used by this customer");
    }
    this.redemptions.push({ code: coupon.code, customerId });
    return Math.round((subtotalCents * coupon.percentOff) / 100);
  }
}
