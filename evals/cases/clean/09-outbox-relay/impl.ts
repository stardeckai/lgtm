export type OutboxRow = { id: number; topic: string; payload: string; sentAt: number | null };

export class Outbox {
  private rows: OutboxRow[] = [];
  private nextId = 1;

  append(topic: string, payload: string): number {
    const id = this.nextId++;
    this.rows.push({ id, topic, payload, sentAt: null });
    return id;
  }

  unsent(): OutboxRow[] {
    return this.rows.filter((r) => r.sentAt === null).sort((a, b) => a.id - b.id);
  }

  markSent(id: number, nowMs: number): void {
    const row = this.rows.find((r) => r.id === id);
    if (row) row.sentAt = nowMs;
  }
}

export function relay(outbox: Outbox, publish: (topic: string, payload: string) => void, nowMs: number): number {
  let sent = 0;
  for (const row of outbox.unsent()) {
    publish(row.topic, row.payload);
    outbox.markSent(row.id, nowMs);
    sent += 1;
  }
  return sent;
}
