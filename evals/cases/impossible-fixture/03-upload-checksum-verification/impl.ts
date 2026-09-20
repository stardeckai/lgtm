export type UploadRow = { key: string; bytes: number; checksum: string; scanned: boolean };

export class UploadStore {
  private rows = new Map<string, UploadRow>();

  insert(row: UploadRow): void {
    if (row.bytes <= 0) throw new Error("upload must have a positive size");
    if (!/^[0-9a-f]{64}$/.test(row.checksum)) throw new Error("upload checksum must be sha256 hex");
    this.rows.set(row.key, row);
  }

  hydrate(rows: UploadRow[]): void {
    for (const row of rows) this.rows.set(row.key, row);
  }

  get(key: string): UploadRow | null {
    return this.rows.get(key) ?? null;
  }
}

export function verifyUpload(store: UploadStore, key: string, observedChecksum: string): string {
  const row = store.get(key);
  if (!row) return "missing";
  if (row.checksum !== observedChecksum) return "corrupt";
  return row.scanned ? "ready" : "pending_scan";
}
