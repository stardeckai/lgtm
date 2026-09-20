export type Event = { id: string; type: string; at: number };

export class EventDeduper {
  private seen = new Map<string, number>();

  constructor(private readonly windowMs: number) {}

  /** exposed for diagnostics */
  size(): number {
    return this.seen.size;
  }

  accept(event: Event): boolean {
    for (const [id, at] of this.seen) {
      if (at <= event.at - this.windowMs) this.seen.delete(id);
    }
    if (this.seen.has(event.id)) return false;
    this.seen.set(event.id, event.at);
    return true;
  }
}
