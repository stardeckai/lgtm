export type Charge = { id: string; orderId: string; amountCents: number };

export class PaymentLedger {
  private charges: Charge[] = [];
  private byKey = new Map<string, string>();

  capture(idempotencyKey: string, orderId: string, amountCents: number): Charge {
    const existingId = this.byKey.get(idempotencyKey);
    if (existingId) return this.charges.find((c) => c.id === existingId)!;
    const charge: Charge = { id: `ch_${this.charges.length + 1}`, orderId, amountCents };
    this.charges.push(charge);
    this.byKey.set(idempotencyKey, charge.id);
    return charge;
  }

  all(): Charge[] {
    return [...this.charges];
  }
}
