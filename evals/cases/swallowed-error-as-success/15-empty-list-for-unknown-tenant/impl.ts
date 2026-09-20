export type Notification = { id: string; tenantId: string; userId: string; readAt: string | null };

export class NotificationReader {
  constructor(private readonly rows: Notification[]) {}

  unreadFor(tenantId: string, userId: string): Notification[] {
    try {
      const mine = this.rows.filter((row) => row.tenantId === tenantId && row.userId === userId);
      return mine.filter((row) => row.readAt === null).sort((a, b) => a.id.localeCompare(b.id));
    } catch (err) {
      console.error("[NotificationReader] unreadFor failed", err);
      return [];
    }
  }
}
