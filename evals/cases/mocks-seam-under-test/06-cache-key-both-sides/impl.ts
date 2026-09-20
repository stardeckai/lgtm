export interface Cache {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
}

export type ReportQuery = { orgId: string; from: string; to: string; currency: string };

export function cacheKey(query: ReportQuery): string {
  return `report:v2:${query.orgId}:${query.from}:${query.to}:${query.currency.toLowerCase()}`;
}

export async function cachedReport(
  cache: Cache,
  query: ReportQuery,
  compute: () => Promise<string>,
): Promise<string> {
  const key = cacheKey(query);
  const hit = await cache.get(key);
  if (hit !== null) return hit;
  const fresh = await compute();
  await cache.set(key, fresh, 300);
  return fresh;
}
