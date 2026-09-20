export type Posting = { account: string; amountCents: number };

export interface LedgerRepository {
  post(reference: string, postings: Posting[]): Promise<void>;
  balance(account: string): Promise<number>;
}

export interface FxSource {
  rate(from: string, to: string): Promise<number>;
}

export interface Clock {
  nowIso(): string;
}

export async function recordPayout(
  ledger: LedgerRepository,
  fx: FxSource,
  clock: Clock,
  payout: { id: string; currency: string; minorUnits: number },
): Promise<Posting[]> {
  const rate = await fx.rate(payout.currency, "USD");
  const usd = Math.round(payout.minorUnits * rate);
  const postings: Posting[] = [
    { account: "payouts_payable", amountCents: -usd },
    { account: "cash", amountCents: usd },
  ];
  await ledger.post(`${payout.id}@${clock.nowIso()}`, postings);
  return postings;
}
