export type BackoffPolicy = { baseMs: number; capMs: number; attempts: number; jitter: boolean };

export function backoffSchedule(policy: BackoffPolicy, random: () => number): number[] {
  const delays: number[] = [];
  for (let attempt = 0; attempt < policy.attempts; attempt += 1) {
    const raw = Math.min(policy.capMs, policy.baseMs * 2 ** attempt);
    delays.push(policy.jitter ? Math.round(raw * (0.5 + random() * 0.5)) : raw);
  }
  return delays;
}
