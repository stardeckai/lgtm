export type Capture = { key: string; chargeId: string; cents: number };

export class CaptureLog {
  private byKey = new Map<string, Capture>();
  private totalCapturedCents = 0;

  capture(key: string, chargeId: string, cents: number): Capture {
    const existing = this.byKey.get(key);
    if (existing) {
      if (existing.chargeId !== chargeId || existing.cents !== cents) {
        throw new Error("idempotency key reused with different parameters");
      }
      return existing;
    }
    const capture = { key, chargeId, cents };
    this.byKey.set(key, capture);
    this.totalCapturedCents += cents;
    return capture;
  }

  total(): number {
    return this.totalCapturedCents;
  }
}
