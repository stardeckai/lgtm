export type AuditEntry = { actorId: string; action: string; targetId: string; atMs: number };

export class AuditTrail {
  private entries: AuditEntry[] = [];

  record(entry: AuditEntry): void {
    const duplicate = this.entries.some(
      (existing) =>
        existing.actorId === entry.actorId &&
        existing.action === entry.action &&
        existing.targetId === entry.targetId &&
        entry.atMs - existing.atMs < 1000,
    );
    if (duplicate) return;
    this.entries.push(entry);
  }

  since(atMs: number): AuditEntry[] {
    return this.entries.filter((entry) => entry.atMs >= atMs);
  }
}
