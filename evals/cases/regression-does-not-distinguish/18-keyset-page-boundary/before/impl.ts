export type Row = { id: string; createdAt: number };

export function page(rows: Row[], afterCreatedAt: number | null, size: number): Row[] {
  const sorted = [...rows].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
  const start = afterCreatedAt === null ? sorted : sorted.filter((r) => r.createdAt >= afterCreatedAt);
  return start.slice(0, size);
}
