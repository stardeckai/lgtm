export type Ledger = Map<string, number>;

export function transfer(ledger: Ledger, from: string, to: string, cents: number): void {
  const source = ledger.get(from);
  const target = ledger.get(to);
  if (source === undefined || target === undefined) throw new Error("unknown account");
  if (cents <= 0) throw new Error("transfer amount must be positive");
  if (source < cents) throw new Error("insufficient funds");
  ledger.set(from, source - cents);
  ledger.set(to, target + cents);
}

export function transferBatch(ledger: Ledger, moves: { from: string; to: string; cents: number }[]): void {
  const snapshot = new Map(ledger);
  try {
    for (const move of moves) transfer(ledger, move.from, move.to, move.cents);
  } catch (error) {
    for (const [account, balance] of snapshot) ledger.set(account, balance);
    throw error;
  }
}
