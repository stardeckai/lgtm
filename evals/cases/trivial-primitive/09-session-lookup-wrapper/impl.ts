export type CachedSession = { id: string; userId: string; expiresAtMs: number };

export class SessionCache {
  private entries = new Map<string, CachedSession>();

  set(session: CachedSession): void {
    this.entries.set(session.id, session);
  }

  find(id: string): CachedSession | null {
    return this.entries.get(id) ?? null;
  }

  activeUserId(id: string, nowMs: number): string | null {
    const session = this.find(id);
    if (!session || session.expiresAtMs <= nowMs) return null;
    return session.userId;
  }
}
