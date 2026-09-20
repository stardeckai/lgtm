export interface SequenceSource {
  next(prefix: string, year: number): string;
}

export class GaplessSequence implements SequenceSource {
  private readonly counters = new Map<string, number>();
  next(prefix: string, year: number): string {
    const key = `${prefix}-${year}`;
    const value = (this.counters.get(key) ?? 0) + 1;
    this.counters.set(key, value);
    return `${prefix}-${year}-${String(value).padStart(5, "0")}`;
  }
}

export type Draft = { orgPrefix: string; issuedAt: string; totalCents: number };

export function issueInvoice(source: SequenceSource, draft: Draft): { number: string; totalCents: number } {
  const year = new Date(draft.issuedAt).getUTCFullYear();
  return { number: source.next(draft.orgPrefix, year), totalCents: draft.totalCents };
}
