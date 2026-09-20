export type Account = { id: string; balanceCents: number; overdraftCents: number };

export function withdraw(account: Account, amountCents: number): Account {
  if (amountCents <= 0) throw new Error("amount must be positive");
  if (account.balanceCents - amountCents < -account.overdraftCents) {
    throw new Error("insufficient funds");
  }
  return { ...account, balanceCents: account.balanceCents - amountCents };
}
