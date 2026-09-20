export type Notification = { id: string; userId: string; kind: string; readAt: number | null };

export class NotificationStore {
  private rows: Notification[] = [];

  push(userId: string, kind: string): Notification {
    const row = { id: `ntf_${this.rows.length + 1}`, userId, kind, readAt: null };
    this.rows.push(row);
    return row;
  }

  markRead(id: string, atMs: number): void {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) throw new Error(`unknown notification ${id}`);
    if (row.readAt !== null) return;
    row.readAt = atMs;
  }

  unreadFor(userId: string): Notification[] {
    return this.rows.filter((row) => row.userId === userId && row.readAt === null);
  }
}
