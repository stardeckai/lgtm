export type Message = { id: string; visibleAtMs: number; body: string };

export class DelayQueue {
  private messages: Message[] = [];

  constructor(private readonly maxDepth: number) {}

  push(message: Message): boolean {
    if (this.messages.length >= this.maxDepth) return false;
    this.messages.push(message);
    return true;
  }

  depth(nowMs: number): number {
    return this.messages.filter((message) => message.visibleAtMs <= nowMs).length;
  }
}
