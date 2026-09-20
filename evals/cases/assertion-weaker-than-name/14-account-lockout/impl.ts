export type Account = { email: string; failedAttempts: number; lockedUntilMs: number | null };

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function recordFailure(account: Account, nowMs: number): Account {
  const failedAttempts = account.failedAttempts + 1;
  if (failedAttempts >= MAX_ATTEMPTS) {
    return { ...account, failedAttempts, lockedUntilMs: nowMs + LOCK_MS };
  }
  return { ...account, failedAttempts, lockedUntilMs: account.lockedUntilMs };
}

export function isLocked(account: Account, nowMs: number): boolean {
  return account.lockedUntilMs !== null && account.lockedUntilMs > nowMs;
}
