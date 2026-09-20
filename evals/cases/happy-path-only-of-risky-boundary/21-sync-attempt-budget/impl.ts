export type SyncOutcome = { synced: number; lastError: string | null; attempts: number };

export async function syncFolder(
  files: string[],
  push: (file: string) => Promise<void>,
  maxAttemptsPerFile: number,
): Promise<SyncOutcome> {
  let synced = 0;
  let attempts = 0;
  let lastError: string | null = null;
  for (const file of files) {
    for (let attempt = 1; attempt <= maxAttemptsPerFile; attempt += 1) {
      attempts += 1;
      try {
        await push(file);
        synced += 1;
        break;
      } catch (error) {
        lastError = (error as Error).message;
      }
    }
  }
  return { synced, lastError, attempts };
}
