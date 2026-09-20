export type QueryKey = { orgId: string; entity: string; filters: Record<string, string | number | boolean> };

export function cacheKey(key: QueryKey): string {
  const filters = Object.keys(key.filters)
    .sort()
    .map((name) => `${name}=${String(key.filters[name])}`)
    .join("&");
  return `${key.orgId}:${key.entity}${filters ? `?${filters}` : ""}`;
}

export class MemoCache<T> {
  private values = new Map<string, T>();
  private hits = 0;

  read(key: QueryKey, load: () => T): T {
    const raw = cacheKey(key);
    const cached = this.values.get(raw);
    if (cached !== undefined) {
      this.hits += 1;
      return cached;
    }
    const value = load();
    this.values.set(raw, value);
    return value;
  }

  hitCount(): number {
    return this.hits;
  }
}
