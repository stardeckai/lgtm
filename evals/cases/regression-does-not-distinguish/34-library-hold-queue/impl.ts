export type Hold = { patron: string; placedAt: number };

export class HoldQueue {
  private holds: Hold[] = [];

  place(patron: string, placedAt: number): void {
    if (this.holds.some((h) => h.patron === patron)) return;
    this.holds.push({ patron, placedAt });
  }

  list(): Hold[] {
    return [...this.holds];
  }

  remove(patron: string): void {
    this.holds = this.holds.filter((h) => h.patron !== patron);
  }
}

export function assignReturnedCopies(
  queue: HoldQueue,
  copies: number,
): string[] {
  const ordered = [...queue.list()].sort((a, b) => a.placedAt - b.placedAt);
  const assigned = ordered.slice(0, copies).map((h) => h.patron);
  for (const patron of assigned) queue.remove(patron);
  return assigned;
}
