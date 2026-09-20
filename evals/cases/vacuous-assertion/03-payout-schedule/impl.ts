export type Account = { id: string; country: "US" | "DE" | "JP"; verified: boolean };

const HOLD_DAYS: Record<Account["country"], number> = { US: 2, DE: 4, JP: 3 };

export function nextPayoutIso(account: Account, capturedIso: string): string {
  if (!account.verified) throw new Error(`account ${account.id} is not verified`);
  const date = new Date(`${capturedIso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + HOLD_DAYS[account.country]);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}
