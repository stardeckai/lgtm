export type Charge = { id: string; amountCents: number };

export class IdempotencyLog {
  private readonly seen = new Map<string, Charge>();
  claim(key: string): boolean {
    if (this.seen.has(key)) return false;
    this.seen.set(key, { id: "", amountCents: 0 });
    return true;
  }
  complete(key: string, charge: Charge): void {
    this.seen.set(key, charge);
  }
  result(key: string): Charge | undefined {
    const entry = this.seen.get(key);
    return entry && entry.id !== "" ? entry : undefined;
  }
}

export interface PaymentGateway {
  charge(amountCents: number): Promise<{ id: string }>;
}

export async function chargeOnce(
  log: IdempotencyLog,
  gateway: PaymentGateway,
  key: string,
  amountCents: number,
): Promise<Charge> {
  const existing = log.result(key);
  if (existing) return existing;
  if (!log.claim(key)) throw new Error("charge already in progress");
  const { id } = await gateway.charge(amountCents);
  const charge: Charge = { id, amountCents };
  log.complete(key, charge);
  return charge;
}
