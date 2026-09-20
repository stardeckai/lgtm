export type Filter = { field: string; op: "eq" | "gt" | "in"; value: unknown };

export type Plan = {
  source: string;
  index: string | null;
  steps: { kind: string; detail: string; estimatedRows: number }[];
  estimatedCost: number;
};

const INDEXED_FIELDS = new Set(["tenantId", "createdAt", "status"]);

export function planQuery(table: string, filters: Filter[], limit: number): Plan {
  const indexed = filters.find((f) => INDEXED_FIELDS.has(f.field));
  const steps = [
    indexed
      ? { kind: "index_scan", detail: `${table}_${indexed.field}_idx on ${indexed.field} ${indexed.op}`, estimatedRows: 200 }
      : { kind: "seq_scan", detail: `${table}`, estimatedRows: 100_000 },
    ...filters
      .filter((f) => f !== indexed)
      .map((f) => ({ kind: "filter", detail: `${f.field} ${f.op} ${JSON.stringify(f.value)}`, estimatedRows: 50 })),
    { kind: "limit", detail: String(limit), estimatedRows: Math.min(limit, 50) },
  ];
  return {
    source: table,
    index: indexed ? `${table}_${indexed.field}_idx` : null,
    steps,
    estimatedCost: steps.reduce((sum, s) => sum + s.estimatedRows, 0),
  };
}
