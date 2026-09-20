export type AttemptResult<T> = { ok: true; value: T } | { ok: false; error: Error };

export async function withRetries<T>(
  operation: () => Promise<T>,
  maxAttempts: number,
  sleep: (ms: number) => Promise<void>,
): Promise<AttemptResult<T>> {
  let lastError = new Error("never attempted");
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return { ok: true, value: await operation() };
    } catch (error) {
      lastError = error as Error;
      if (attempt + 1 < maxAttempts) await sleep(1000 * 2 ** attempt);
    }
  }
  return { ok: false, error: lastError };
}
