export type QueueMessage = { id: string; body: string; receives: number; visibleAtMs: number };

export class VisibilityQueue {
  private messages: QueueMessage[] = [];
  readonly deadLetters: QueueMessage[] = [];

  send(id: string, body: string): void {
    this.messages.push({ id, body, receives: 0, visibleAtMs: 0 });
  }

  receive(nowMs: number, visibilityMs: number): QueueMessage | null {
    const message = this.messages.find((candidate) => candidate.visibleAtMs <= nowMs);
    if (!message) return null;
    message.receives += 1;
    if (message.receives > 3) {
      this.messages = this.messages.filter((candidate) => candidate.id !== message.id);
      this.deadLetters.push(message);
      return null;
    }
    message.visibleAtMs = nowMs + visibilityMs;
    return message;
  }

  ack(id: string): void {
    this.messages = this.messages.filter((message) => message.id !== id);
  }
}
