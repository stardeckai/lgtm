export type SalesRow = { orgId: string; region: string; cents: number };

export function regionTotals(rows: SalesRow[], orgId: string): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const row of rows) {
    if (row.orgId !== orgId) continue;
    totals[row.region] = (totals[row.region] ?? 0) + row.cents;
  }
  return totals;
}
