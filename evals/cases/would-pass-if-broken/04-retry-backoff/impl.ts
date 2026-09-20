export type BackoffOptions = { baseMs: number; maxMs: number; attempts: number; jitter: boolean };

export function backoffSchedule(options: BackoffOptions): number[] {
  const delays: number[] = [];
  let current = options.baseMs;
  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    const capped = Math.min(current, options.maxMs);
    delays.push(options.jitter ? Math.round(capped * 0.75) : capped);
    current = current * 2;
  }
  return delays;
}
