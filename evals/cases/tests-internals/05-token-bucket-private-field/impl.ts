export class TokenBuckets {
  private buckets = new Map<string, { tokens: number; refilledAt: number }>();

  constructor(
    private readonly capacity: number,
    private readonly refillPerMs: number,
  ) {}

  consume(key: string, now: number): boolean {
    const bucket = this.buckets.get(key) ?? { tokens: this.capacity, refilledAt: now };
    const refill = (now - bucket.refilledAt) * this.refillPerMs;
    const tokens = Math.min(this.capacity, bucket.tokens + refill);
    if (tokens < 1) {
      this.buckets.set(key, { tokens, refilledAt: now });
      return false;
    }
    this.buckets.set(key, { tokens: tokens - 1, refilledAt: now });
    return true;
  }
}
