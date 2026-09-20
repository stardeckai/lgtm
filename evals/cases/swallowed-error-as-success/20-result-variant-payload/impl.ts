export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: { kind: "insufficient_funds"; shortfallCents: number } | { kind: "account_frozen"; since: string } };

export type Account = { id: string; balanceCents: number; frozenSince: string | null };

export function withdraw(account: Account, cents: number): Result<number> {
  if (account.frozenSince) return { ok: false, error: { kind: "account_frozen", since: account.frozenSince } };
  if (account.balanceCents < cents) {
    return { ok: false, error: { kind: "insufficient_funds", shortfallCents: cents - account.balanceCents } };
  }
  return { ok: true, value: account.balanceCents - cents };
}
