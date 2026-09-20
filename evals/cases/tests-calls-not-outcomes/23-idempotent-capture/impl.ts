export interface Psp {
  capture(intentId: string, cents: number): Promise<{ id: string }>;
}

export class CaptureLedger {
  private byKey = new Map<string, string>();
  get(key: string): string | undefined {
    return this.byKey.get(key);
  }
  remember(key: string, captureId: string): void {
    this.byKey.set(key, captureId);
  }
}

export async function captureOnce(
  psp: Psp,
  ledger: CaptureLedger,
  idempotencyKey: string,
  intentId: string,
  cents: number,
): Promise<string> {
  const existing = ledger.get(idempotencyKey);
  if (existing) return existing;
  const capture = await psp.capture(intentId, cents);
  ledger.remember(idempotencyKey, capture.id);
  return capture.id;
}
