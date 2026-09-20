export class ConflictError extends Error {
  constructor(
    readonly currentVersion: number,
    readonly attemptedVersion: number,
  ) {
    super(`version ${attemptedVersion} is stale, current is ${currentVersion}`);
    this.name = "ConflictError";
  }
}

export type Record_ = { id: string; version: number; body: string };

export class VersionedStore {
  private rows = new Map<string, Record_>();

  seed(row: Record_): void {
    this.rows.set(row.id, row);
  }

  update(id: string, expectedVersion: number, body: string): Record_ {
    const current = this.rows.get(id);
    if (!current) throw new Error("not_found");
    if (current.version !== expectedVersion) throw new ConflictError(current.version, expectedVersion);
    const next = { id, version: current.version + 1, body };
    this.rows.set(id, next);
    return next;
  }

  read(id: string): Record_ | undefined {
    return this.rows.get(id);
  }
}
