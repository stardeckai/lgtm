export type PayoutAccount = {
  id: string;
  country: string;
  verified: boolean;
  payoutsEnabled: boolean;
  balanceCents: number;
};

export function registerAccount(id: string, country: string): PayoutAccount {
  return { id, country, verified: false, payoutsEnabled: false, balanceCents: 0 };
}

export function markVerified(account: PayoutAccount): PayoutAccount {
  return { ...account, verified: true, payoutsEnabled: true };
}

export function nextPayoutCents(account: PayoutAccount, minimumCents: number): number {
  if (!account.payoutsEnabled) return 0;
  if (account.balanceCents < minimumCents) return 0;
  return account.balanceCents;
}
