export type Column = { name: string; type: string; nullable: boolean };
export type Table = { name: string; columns: Column[] };

export function diffSchema(before: Table[], after: Table[]): string[] {
  const out: string[] = [];
  const beforeByName = new Map(before.map((t) => [t.name, t]));
  for (const table of after) {
    const old = beforeByName.get(table.name);
    if (!old) {
      out.push(`create table ${table.name}`);
      continue;
    }
    const oldColumns = new Map(old.columns.map((c) => [c.name, c]));
    for (const column of table.columns) {
      const previous = oldColumns.get(column.name);
      if (!previous) out.push(`add ${table.name}.${column.name} ${column.type}${column.nullable ? "" : " not null"}`);
      else if (previous.nullable && !column.nullable) out.push(`tighten ${table.name}.${column.name} to not null`);
    }
    for (const column of old.columns) {
      if (!table.columns.some((c) => c.name === column.name)) out.push(`drop ${table.name}.${column.name}`);
    }
  }
  return out;
}
