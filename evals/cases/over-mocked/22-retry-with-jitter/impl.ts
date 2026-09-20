export type Attempt = { delayMs: number; attempt: number };

export function retryPlan(
  maxAttempts: number,
  baseMs: number,
  capMs: number,
  random: () => number,
): Attempt[] {
  const plan: Attempt[] = [];
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const exponential = Math.min(capMs, baseMs * 2 ** (attempt - 1));
    const jitter = Math.floor(exponential * 0.5 * random());
    plan.push({ attempt, delayMs: exponential - jitter });
  }
  return plan;
}

export async function withRetries<T>(
  plan: Attempt[],
  sleep: (ms: number) => Promise<void>,
  operation: () => Promise<T>,
): Promise<T> {
  let lastError: unknown;
  for (const step of plan) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      await sleep(step.delayMs);
    }
  }
  throw lastError;
}
