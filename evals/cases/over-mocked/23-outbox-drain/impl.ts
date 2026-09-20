export type Message = { id: string; to: string; body: string; attempts: number };

export class Outbox {
  private rows: Message[] = [];
  enqueue(message: Message): void {
    this.rows.push(message);
  }
  pending(): Message[] {
    return this.rows.filter((m) => m.attempts < 3);
  }
  recordFailure(id: string): void {
    const row = this.rows.find((m) => m.id === id);
    if (row) row.attempts++;
  }
  remove(id: string): void {
    this.rows = this.rows.filter((m) => m.id !== id);
  }
  all(): Message[] {
    return this.rows;
  }
}

export interface Transport {
  send(to: string, body: string): Promise<void>;
}

export async function drain(outbox: Outbox, transport: Transport): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (const message of outbox.pending()) {
    try {
      await transport.send(message.to, message.body);
      outbox.remove(message.id);
      sent++;
    } catch {
      outbox.recordFailure(message.id);
      failed++;
    }
  }
  return { sent, failed };
}
