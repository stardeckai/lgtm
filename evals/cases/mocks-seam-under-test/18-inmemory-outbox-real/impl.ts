export type OutboxRow = { id: string; topic: string; body: string; publishedAt: string | null };

export class Outbox {
  private rows: OutboxRow[] = [];
  enqueue(topic: string, body: unknown): OutboxRow {
    const row: OutboxRow = {
      id: `ob_${this.rows.length + 1}`,
      topic,
      body: JSON.stringify(body),
      publishedAt: null,
    };
    this.rows.push(row);
    return row;
  }
  pending(): OutboxRow[] {
    return this.rows.filter((row) => row.publishedAt === null);
  }
  markPublished(id: string, atIso: string): void {
    const row = this.rows.find((r) => r.id === id);
    if (!row) throw new Error(`unknown outbox row ${id}`);
    row.publishedAt = atIso;
  }
}

export interface Sender {
  send(topic: string, body: string): Promise<void>;
}

export async function drain(outbox: Outbox, sender: Sender, atIso: string): Promise<number> {
  let sent = 0;
  for (const row of outbox.pending()) {
    await sender.send(row.topic, row.body);
    outbox.markPublished(row.id, atIso);
    sent += 1;
  }
  return sent;
}
