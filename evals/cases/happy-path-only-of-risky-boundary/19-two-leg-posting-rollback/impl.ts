export type Account = { id: string; balanceCents: number; frozen: boolean };

export class Bank {
  constructor(private accounts: Account[]) {}

  find(id: string): Account {
    const account = this.accounts.find((candidate) => candidate.id === id);
    if (!account) throw new Error(`unknown account ${id}`);
    return account;
  }

  post(fromId: string, toId: string, cents: number): void {
    const from = this.find(fromId);
    const to = this.find(toId);
    from.balanceCents -= cents;
    try {
      if (to.frozen) throw new Error("destination account is frozen");
      to.balanceCents += cents;
    } catch (error) {
      from.balanceCents += cents;
      throw error;
    }
  }
}
