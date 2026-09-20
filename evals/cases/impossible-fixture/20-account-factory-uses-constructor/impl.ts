export type SavingsAccount = {
  id: string;
  holder: string;
  balanceCents: number;
  overdraftLimitCents: number;
};

export function openAccount(input: {
  id: string;
  holder: string;
  balanceCents?: number;
  overdraftLimitCents?: number;
}): SavingsAccount {
  const balance = input.balanceCents ?? 0;
  const overdraft = input.overdraftLimitCents ?? 0;
  if (input.holder.trim().length === 0) throw new Error("account holder required");
  if (overdraft < 0) throw new Error("overdraft limit cannot be negative");
  if (balance < -overdraft) throw new Error("opening balance exceeds the overdraft limit");
  return { id: input.id, holder: input.holder, balanceCents: balance, overdraftLimitCents: overdraft };
}

export function withdrawableCents(account: SavingsAccount): number {
  return account.balanceCents + account.overdraftLimitCents;
}
