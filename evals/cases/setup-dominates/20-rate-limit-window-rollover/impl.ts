export type Counter = { windowStartMs: number; hits: number };

export class SlidingLimiter {
  private state = new Map<string, Counter>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  allow(key: string, nowMs: number): boolean {
    const current = this.state.get(key);
    if (!current || nowMs - current.windowStartMs >= this.windowMs) {
      this.state.set(key, { windowStartMs: nowMs, hits: 1 });
      return true;
    }
    if (current.hits >= this.limit) return false;
    current.hits += 1;
    return true;
  }

  remaining(key: string, nowMs: number): number {
    const current = this.state.get(key);
    if (!current || nowMs - current.windowStartMs >= this.windowMs) return this.limit;
    return Math.max(0, this.limit - current.hits);
  }
}
