export type MigrationFile = { id: string; sql: string; checksum: string };

export interface Journal {
  applied(): Promise<Array<{ id: string; checksum: string }>>;
  record(id: string, checksum: string, atMs: number): Promise<void>;
}

export interface SqlRunner {
  exec(sql: string): Promise<void>;
}

export async function migrate(
  journal: Journal,
  runner: SqlRunner,
  files: MigrationFile[],
  nowMs: number,
): Promise<string[]> {
  const applied = await journal.applied();
  const byId = new Map(applied.map((entry) => [entry.id, entry.checksum]));
  const ran: string[] = [];
  for (const file of files) {
    const seen = byId.get(file.id);
    if (seen !== undefined) {
      if (seen !== file.checksum) throw new Error(`migration ${file.id} changed after being applied`);
      continue;
    }
    await runner.exec(file.sql);
    await journal.record(file.id, file.checksum, nowMs);
    ran.push(file.id);
  }
  return ran;
}
