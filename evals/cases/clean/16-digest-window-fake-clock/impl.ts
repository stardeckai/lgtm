export type Alert = { key: string; text: string };

export class AlertBuffer {
  private pending = new Map<string, { alert: Alert; firstSeenMs: number; count: number }>();

  constructor(private readonly windowMs: number) {}

  observe(alert: Alert, nowMs: number): void {
    const entry = this.pending.get(alert.key);
    if (entry) {
      entry.count += 1;
      return;
    }
    this.pending.set(alert.key, { alert, firstSeenMs: nowMs, count: 1 });
  }

  flush(nowMs: number): Array<{ key: string; text: string; count: number }> {
    const out: Array<{ key: string; text: string; count: number }> = [];
    for (const [key, entry] of this.pending) {
      if (nowMs - entry.firstSeenMs < this.windowMs) continue;
      out.push({ key, text: entry.alert.text, count: entry.count });
      this.pending.delete(key);
    }
    return out.sort((a, b) => a.key.localeCompare(b.key));
  }
}
