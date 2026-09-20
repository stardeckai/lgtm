export type CheckoutResult = { orderId: string; chargedCents: number };

export class Checkout {
  private results = new Map<string, CheckoutResult>();
  private sequence = 0;
  chargedTotal = 0;

  submit(idempotencyKey: string, cents: number): CheckoutResult {
    const existing = this.results.get(idempotencyKey);
    if (existing) return existing;
    this.sequence += 1;
    const result = { orderId: `ord_${this.sequence}`, chargedCents: cents };
    this.results.set(idempotencyKey, result);
    this.chargedTotal += cents;
    return result;
  }
}
