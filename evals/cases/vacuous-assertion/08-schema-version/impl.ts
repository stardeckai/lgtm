export type Migration = { version: number; name: string; up: (rows: Row[]) => Row[] };

export type Row = { id: string; planCode: string; seats: number };

export const MIGRATIONS: Migration[] = [
  { version: 1, name: "seed-plan-codes", up: (rows) => rows.map((r) => ({ ...r, planCode: r.planCode || "free" })) },
  { version: 2, name: "rename-starter", up: (rows) => rows.map((r) => (r.planCode === "starter" ? { ...r, planCode: "basic" } : r)) },
  { version: 3, name: "min-one-seat", up: (rows) => rows.map((r) => ({ ...r, seats: Math.max(1, r.seats) })) },
];

export const LATEST_VERSION = MIGRATIONS[MIGRATIONS.length - 1]!.version;

export function migrate(rows: Row[], fromVersion: number): Row[] {
  return MIGRATIONS.filter((m) => m.version > fromVersion).reduce((acc, m) => m.up(acc), rows);
}
