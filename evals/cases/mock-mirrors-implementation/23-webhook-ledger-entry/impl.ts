export type LedgerEntry = { account: string; debitCents: number; creditCents: number; memo: string };

export interface EventSource {
  fetch(eventId: string): Promise<{ type: string; data: Record<string, unknown> }>;
}

export async function ledgerEntriesFor(source: EventSource, eventId: string): Promise<LedgerEntry[]> {
  const event = await source.fetch(eventId);
  if (event.type !== "charge.succeeded") return [];
  const gross = Number(event.data.amount);
  const fee = Number(event.data.application_fee_amount ?? 0);
  const memo = `charge ${String(event.data.id)}`;
  return [
    { account: "cash", debitCents: gross - fee, creditCents: 0, memo },
    { account: "processor_fees", debitCents: fee, creditCents: 0, memo },
    { account: "revenue", debitCents: 0, creditCents: gross, memo },
  ];
}
