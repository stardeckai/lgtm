export type Row = Record<string, string | number | null>;

export class Table {
  constructor(public columns: string[], public rows: Row[]) {}

  clone(): Table {
    return new Table([...this.columns], this.rows.map((r) => ({ ...r })));
  }
}

export type Migration = {
  id: string;
  up: (table: Table) => void;
  down: (table: Table) => void;
};

export function runMigrations(table: Table, migrations: Migration[]): { applied: string[]; table: Table } {
  const working = table.clone();
  const applied: string[] = [];
  for (const migration of migrations) {
    const checkpoint = working.clone();
    try {
      migration.up(working);
      applied.push(migration.id);
    } catch (error) {
      migration.down(checkpoint);
      return { applied, table: checkpoint };
    }
  }
  return { applied, table: working };
}
