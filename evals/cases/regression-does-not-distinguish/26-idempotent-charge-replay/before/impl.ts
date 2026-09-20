export type Charge = { id: string; amountCents: number; key: string };

export class ChargeBook {
  private charges: Charge[] = [];
  private nextId = 1;

  charge(key: string, amountCents: number): Charge {
    const created: Charge = { id: `ch_${this.nextId++}`, amountCents, key };
    this.charges.push(created);
    return created;
  }

  all(): Charge[] {
    return [...this.charges];
  }
}
