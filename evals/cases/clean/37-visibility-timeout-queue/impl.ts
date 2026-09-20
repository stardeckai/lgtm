export type Message = { id: string; body: string; receipts: number };

export class VisibilityQueue {
  private messages: Array<Message & { invisibleUntilMs: number }> = [];

  constructor(private readonly visibilityMs: number, private readonly maxReceipts: number) {}

  send(id: string, body: string): void {
    this.messages.push({ id, body, receipts: 0, invisibleUntilMs: 0 });
  }

  receive(nowMs: number): Message | null {
    const message = this.messages.find((m) => m.invisibleUntilMs <= nowMs);
    if (!message) return null;
    message.receipts += 1;
    message.invisibleUntilMs = nowMs + this.visibilityMs;
    return { id: message.id, body: message.body, receipts: message.receipts };
  }

  delete(id: string): void {
    this.messages = this.messages.filter((m) => m.id !== id);
  }

  deadLetters(): Message[] {
    return this.messages
      .filter((m) => m.receipts > this.maxReceipts)
      .map((m) => ({ id: m.id, body: m.body, receipts: m.receipts }));
  }
}
