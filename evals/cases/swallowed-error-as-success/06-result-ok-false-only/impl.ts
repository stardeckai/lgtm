export type Transfer = { fromId: string; toId: string; cents: number };
export type Outcome = { ok: boolean; balanceCents?: number };

export class Ledger {
  constructor(private balances: Map<string, number>) {}

  transfer(transfer: Transfer): Outcome {
    try {
      const from = this.balances.get(transfer.fromId);
      const to = this.balances.get(transfer.toId);
      if (from === undefined || to === undefined) return { ok: false };
      if (from < transfer.cents) return { ok: false };
      this.balances.set(transfer.fromId, from - transfer.cents);
      this.balances.set(transfer.toId, to + transfer.cents);
      return { ok: true, balanceCents: from - transfer.cents };
    } catch {
      return { ok: false };
    }
  }
}
