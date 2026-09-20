export type Query = { tenantId: string; table: string; filters: Record<string, string | number> };

export interface Backend {
  run(query: Query): Promise<unknown[]>;
}

export class QueryCache {
  private entries = new Map<string, unknown[]>();
  constructor(private readonly backend: Backend) {}

  private cacheKey(query: Query): string {
    const filters = Object.keys(query.filters)
      .sort()
      .map((k) => `${k}=${query.filters[k]}`)
      .join("&");
    return `${query.tenantId}|${query.table}|${filters}`;
  }

  async run(query: Query): Promise<unknown[]> {
    const key = this.cacheKey(query);
    const hit = this.entries.get(key);
    if (hit) return hit;
    const rows = await this.backend.run(query);
    this.entries.set(key, rows);
    return rows;
  }
}
