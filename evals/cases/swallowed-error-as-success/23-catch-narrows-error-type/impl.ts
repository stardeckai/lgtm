export class QuotaExceeded extends Error {
  constructor(
    readonly limit: number,
    readonly used: number,
  ) {
    super(`quota of ${limit} exceeded (${used} used)`);
    this.name = "QuotaExceeded";
  }
}

export type Plan = { uploadsPerDay: number };

export class UploadGate {
  private used = 0;
  constructor(private readonly plan: Plan) {}

  accept(sizeBytes: number): { id: string; sizeBytes: number } {
    if (sizeBytes <= 0) throw new TypeError("sizeBytes must be positive");
    if (this.used >= this.plan.uploadsPerDay) throw new QuotaExceeded(this.plan.uploadsPerDay, this.used);
    this.used += 1;
    return { id: `upl_${this.used}`, sizeBytes };
  }

  usedToday(): number {
    return this.used;
  }
}
