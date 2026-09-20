export type Entry = { actorId: string; action: string; targetId: string; atMs: number };

export class Trail {
  private entries: Entry[] = [];

  record(entry: Entry): void {
    const last = this.entries[this.entries.length - 1];
    if (
      last &&
      last.actorId === entry.actorId &&
      last.action === entry.action &&
      last.targetId === entry.targetId &&
      entry.atMs - last.atMs < 1000
    ) {
      return;
    }
    this.entries.push(entry);
  }

  all(): Entry[] {
    return [...this.entries];
  }
}
