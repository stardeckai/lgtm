export class RateLimiter {
  private counts = new Map<string, { hits: number; windowStartMs: number }>();

  constructor(private readonly limit: number, private readonly windowMs: number) {}

  allow(key: string, nowMs: number): boolean {
    const entry = this.counts.get(key) ?? { hits: 0, windowStartMs: nowMs };
    if (nowMs - entry.windowStartMs >= this.windowMs) {
      entry.hits = 0;
      entry.windowStartMs = nowMs;
    }
    entry.hits += 1;
    this.counts.set(key, entry);
    return entry.hits <= this.limit;
  }
}
