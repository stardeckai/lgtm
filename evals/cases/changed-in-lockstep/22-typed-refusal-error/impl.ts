export class InsufficientFunds extends Error {
  constructor(readonly shortfallCents: number) {
    super("insufficient funds");
    this.name = "InsufficientFunds";
  }
}

export type Account = { id: string; balanceCents: number; overdraftCents: number };

export function withdraw(account: Account, amountCents: number): Account {
  if (amountCents <= 0) throw new Error("amount must be positive");
  const remaining = account.balanceCents - amountCents;
  if (remaining < -account.overdraftCents) {
    throw new InsufficientFunds(-account.overdraftCents - remaining);
  }
  return { ...account, balanceCents: remaining };
}
