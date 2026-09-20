export type Payout = { accountId: string; capturedIso: string; country: "US" | "DE" };

const HOLD_DAYS: Record<Payout["country"], number> = { US: 2, DE: 4 };

export function releaseIso(payout: Payout): string {
  const date = new Date(`${payout.capturedIso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + HOLD_DAYS[payout.country]);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}
