export type PromoUse = { code: string; customerId: string; usedAtMs: number };

export class PromoService {
  private uses: PromoUse[] = [];

  constructor(private readonly maxUsesPerCustomer: number) {}

  apply(code: string, customerId: string, nowMs: number): number {
    const used = this.uses.filter((use) => use.code === code && use.customerId === customerId).length;
    if (used >= this.maxUsesPerCustomer) throw new Error(`${code} already redeemed by this customer`);
    this.uses.push({ code, customerId, usedAtMs: nowMs });
    return this.maxUsesPerCustomer - used - 1;
  }
}
