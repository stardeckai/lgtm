export type Charge = { id: string; capturedCents: number; refundedCents: number };

export class ChargeBook {
  private charges = new Map<string, Charge>();

  add(charge: Charge): void {
    this.charges.set(charge.id, charge);
  }

  refund(chargeId: string, cents: number): Charge {
    const charge = this.charges.get(chargeId);
    if (!charge) throw new Error(`unknown charge ${chargeId}`);
    if (cents <= 0) throw new Error("refund must be positive");
    if (charge.refundedCents + cents > charge.capturedCents) {
      throw new Error("refund exceeds the captured amount");
    }
    const next = { ...charge, refundedCents: charge.refundedCents + cents };
    this.charges.set(chargeId, next);
    return next;
  }
}
