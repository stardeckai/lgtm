export type Decision = { allowed: boolean; remaining: number; retryAfterMs: number };

export class SlidingWindowLimiter {
  private hits = new Map<string, number[]>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly now: () => number,
  ) {}

  take(key: string): Decision {
    const t = this.now();
    const recent = (this.hits.get(key) ?? []).filter((at) => at > t - this.windowMs);
    if (recent.length >= this.limit) {
      const oldest = recent[0]!;
      this.hits.set(key, recent);
      return { allowed: false, remaining: 0, retryAfterMs: oldest + this.windowMs - t };
    }
    recent.push(t);
    this.hits.set(key, recent);
    return { allowed: true, remaining: this.limit - recent.length, retryAfterMs: 0 };
  }
}
