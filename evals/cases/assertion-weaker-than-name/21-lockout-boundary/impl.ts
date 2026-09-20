export type Account = { email: string; failedAttempts: number; lockedUntilMs: number | null };

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export function recordFailure(account: Account, nowMs: number): Account {
  const failedAttempts = account.failedAttempts + 1;
  return failedAttempts >= MAX_ATTEMPTS
    ? { ...account, failedAttempts, lockedUntilMs: nowMs + LOCK_MS }
    : { ...account, failedAttempts };
}

export function isLocked(account: Account, nowMs: number): boolean {
  return account.lockedUntilMs !== null && account.lockedUntilMs > nowMs;
}
