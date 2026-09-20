export interface Steps {
  lockTable(): Promise<void>;
  backfill(batch: number): Promise<void>;
  dropLegacyColumn(): Promise<void>;
  unlockTable(): Promise<void>;
}

export async function runColumnMigration(steps: Steps, rowCount: number): Promise<number> {
  await steps.lockTable();
  const batches = Math.ceil(rowCount / 500);
  try {
    for (let i = 0; i < batches; i++) await steps.backfill(i);
    await steps.dropLegacyColumn();
  } finally {
    await steps.unlockTable();
  }
  return batches;
}
