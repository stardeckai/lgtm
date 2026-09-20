export type Entry = { account: string; debitCents: number; creditCents: number };

export class Ledger {
  private entries: Entry[] = [];

  post(entries: Entry[]): void {
    const debits = entries.reduce((sum, e) => sum + e.debitCents, 0);
    const credits = entries.reduce((sum, e) => sum + e.creditCents, 0);
    if (debits !== credits) throw new Error(`unbalanced transaction: ${debits} vs ${credits}`);
    this.entries.push(...entries);
  }

  balance(account: string): number {
    return this.entries
      .filter((e) => e.account === account)
      .reduce((sum, e) => sum + e.debitCents - e.creditCents, 0);
  }
}
