import { isEligibleForDunning } from "./eligibility";
import { attemptsFor } from "./attempts";

export type Account = { id: string; email: string; pastDueCents: number; graceDaysLeft: number };

export function dunningEmail(account: Account, now: Date): { to: string; subject: string; body: string } | null {
  if (!isEligibleForDunning(account, now)) return null;
  const attempt = attemptsFor(account.id);
  const urgency = attempt >= 3 ? "Final notice" : "Payment reminder";
  return {
    to: account.email,
    subject: `${urgency}: ฿${(account.pastDueCents / 100).toFixed(2)} past due`,
    body: `We could not collect ฿${(account.pastDueCents / 100).toFixed(2)}. You have ${account.graceDaysLeft} days left before we pause your apps.`,
  };
}
