export type Record_ = { key: string; resultId: string };

export class IdempotencyStore {
  private memory = new Map<string, string>();

  constructor(private readonly durable: Map<string, string>) {
    for (const [key, value] of durable) this.memory.set(key, value);
  }

  remember(key: string, resultId: string): string {
    const seen = this.memory.get(key);
    if (seen !== undefined) return seen;
    this.memory.set(key, resultId);
    this.durable.set(key, resultId);
    return resultId;
  }
}
