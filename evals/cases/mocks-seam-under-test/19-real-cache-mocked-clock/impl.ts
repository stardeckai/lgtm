export class TtlCache<T> {
  private readonly entries = new Map<string, { value: T; expiresAtMs: number }>();
  constructor(private readonly now: () => number) {}
  set(key: string, value: T, ttlMs: number): void {
    this.entries.set(key, { value, expiresAtMs: this.now() + ttlMs });
  }
  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAtMs <= this.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }
  get size(): number {
    return this.entries.size;
  }
}

export async function memoize<T>(
  cache: TtlCache<T>,
  key: string,
  ttlMs: number,
  load: () => Promise<T>,
): Promise<T> {
  const hit = cache.get(key);
  if (hit !== undefined) return hit;
  const fresh = await load();
  cache.set(key, fresh, ttlMs);
  return fresh;
}
