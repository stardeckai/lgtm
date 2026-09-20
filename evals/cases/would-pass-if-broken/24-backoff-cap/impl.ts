export type RetryPolicy = { baseMs: number; factor: number; maxMs: number; maxAttempts: number };

export function delaysFor(policy: RetryPolicy): number[] {
  const delays: number[] = [];
  let current = policy.baseMs;
  while (delays.length < policy.maxAttempts) {
    delays.push(Math.min(current, policy.maxMs));
    current = Math.round(current * policy.factor);
  }
  return delays;
}
