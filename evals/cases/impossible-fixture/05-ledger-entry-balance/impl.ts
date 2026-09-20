export type Posting = { account: string; amountCents: number };
export type JournalEntry = { id: string; postings: Posting[] };

export function buildEntry(id: string, postings: Posting[]): JournalEntry {
  if (postings.length < 2) throw new Error("an entry needs at least two postings");
  const net = postings.reduce((sum, posting) => sum + posting.amountCents, 0);
  if (net !== 0) throw new Error(`entry ${id} does not balance: ${net}`);
  return { id, postings };
}

export function accountMovement(entries: JournalEntry[], account: string): number {
  return entries
    .flatMap((entry) => entry.postings)
    .filter((posting) => posting.account === account)
    .reduce((sum, posting) => sum + posting.amountCents, 0);
}

export function trialBalance(entries: JournalEntry[]): Map<string, number> {
  const accounts = new Set(entries.flatMap((e) => e.postings.map((p) => p.account)));
  return new Map([...accounts].map((account) => [account, accountMovement(entries, account)]));
}
