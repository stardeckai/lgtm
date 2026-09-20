export type Decision = { allowed: boolean; remaining: number; retryAfterMs: number };

export interface WindowCounter {
  hit(key: string, nowMs: number, windowMs: number): { count: number; windowStartMs: number };
}

export class FixedWindowCounter implements WindowCounter {
  private readonly windows = new Map<string, { count: number; windowStartMs: number }>();
  hit(key: string, nowMs: number, windowMs: number) {
    const current = this.windows.get(key);
    if (!current || nowMs - current.windowStartMs >= windowMs) {
      const fresh = { count: 1, windowStartMs: nowMs - (nowMs % windowMs) };
      this.windows.set(key, fresh);
      return fresh;
    }
    current.count += 1;
    return current;
  }
}

export function checkLimit(
  counter: WindowCounter,
  key: string,
  nowMs: number,
  limit: number,
  windowMs: number,
): Decision {
  const { count, windowStartMs } = counter.hit(key, nowMs, windowMs);
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterMs: count <= limit ? 0 : windowStartMs + windowMs - nowMs,
  };
}
