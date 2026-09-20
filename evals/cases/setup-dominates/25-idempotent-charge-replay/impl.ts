export type ChargeRequest = { idempotencyKey: string; customerId: string; amountCents: number };
export type Charge = { id: string; customerId: string; amountCents: number };

export class ChargeService {
  private byKey = new Map<string, Charge>();
  private sequence = 0;

  charge(request: ChargeRequest): Charge {
    const existing = this.byKey.get(request.idempotencyKey);
    if (existing) {
      if (existing.amountCents !== request.amountCents) throw new Error("idempotency_key_reused");
      return existing;
    }
    this.sequence += 1;
    const charge: Charge = { id: `ch_${this.sequence}`, customerId: request.customerId, amountCents: request.amountCents };
    this.byKey.set(request.idempotencyKey, charge);
    return charge;
  }

  count(): number {
    return this.sequence;
  }
}
