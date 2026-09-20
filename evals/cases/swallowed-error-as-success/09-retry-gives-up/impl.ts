export type Attempt<T> = () => Promise<T>;

export async function withRetries<T>(attempt: Attempt<T>, maxAttempts: number, fallback: T): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      return await attempt();
    } catch (err) {
      lastError = err;
    }
  }
  void lastError;
  return fallback;
}
