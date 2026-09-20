export class SeenEvents {
  private seen = new Map<string, number>();

  constructor(private readonly ttlMs: number) {}

  private sweep(nowMs: number): void {
    for (const [id, expiry] of this.seen) {
      if (expiry <= nowMs) this.seen.delete(id);
    }
  }

  accept(id: string, nowMs: number): boolean {
    this.sweep(nowMs);
    if (this.seen.has(id)) return false;
    this.seen.set(id, nowMs + this.ttlMs);
    return true;
  }

  size(nowMs: number): number {
    this.sweep(nowMs);
    return this.seen.size;
  }
}

export function ingest(dedupe: SeenEvents, ids: string[], nowMs: number): string[] {
  return ids.filter((id) => dedupe.accept(id, nowMs));
}
