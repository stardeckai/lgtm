export type Message = { id: string; body: string; visibleAtMs: number; receives: number };

export class DelayQueue {
  private readonly messages: Message[] = [];
  constructor(private readonly now: () => number) {}
  push(id: string, body: string, delayMs = 0): void {
    this.messages.push({ id, body, visibleAtMs: this.now() + delayMs, receives: 0 });
  }
  receive(visibilityMs: number): Message | null {
    const next = this.messages
      .filter((m) => m.visibleAtMs <= this.now())
      .sort((a, b) => a.visibleAtMs - b.visibleAtMs)[0];
    if (!next) return null;
    next.receives += 1;
    next.visibleAtMs = this.now() + visibilityMs;
    return next;
  }
  ack(id: string): void {
    const index = this.messages.findIndex((m) => m.id === id);
    if (index >= 0) this.messages.splice(index, 1);
  }
  get depth(): number {
    return this.messages.length;
  }
}

export interface Downstream {
  deliver(body: string): Promise<void>;
}

export async function pump(queue: DelayQueue, downstream: Downstream): Promise<boolean> {
  const message = queue.receive(30_000);
  if (!message) return false;
  await downstream.deliver(message.body);
  queue.ack(message.id);
  return true;
}
