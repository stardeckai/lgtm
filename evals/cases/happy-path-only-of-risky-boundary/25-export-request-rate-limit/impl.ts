export type Window = { startedAtMs: number; count: number };

export class RateLimiter {
  private windows = new Map<string, Window>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  take(key: string, nowMs: number): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const window = this.windows.get(key);
    if (!window || nowMs - window.startedAtMs >= this.windowMs) {
      this.windows.set(key, { startedAtMs: nowMs, count: 1 });
      return { allowed: true, remaining: this.limit - 1, retryAfterMs: 0 };
    }
    if (window.count >= this.limit) {
      return { allowed: false, remaining: 0, retryAfterMs: window.startedAtMs + this.windowMs - nowMs };
    }
    window.count += 1;
    return { allowed: true, remaining: this.limit - window.count, retryAfterMs: 0 };
  }
}
