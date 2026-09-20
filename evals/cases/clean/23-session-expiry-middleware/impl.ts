export type Session = { id: string; userId: string; lastSeenMs: number; absoluteExpiryMs: number };

export class SessionStore {
  private sessions = new Map<string, Session>();

  create(id: string, userId: string, nowMs: number, lifetimeMs: number): Session {
    const session = { id, userId, lastSeenMs: nowMs, absoluteExpiryMs: nowMs + lifetimeMs };
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  drop(id: string): void {
    this.sessions.delete(id);
  }
}

export function authenticate(
  store: SessionStore,
  sessionId: string,
  nowMs: number,
  idleTimeoutMs: number,
): { userId: string } | { error: "unknown" | "idle" | "expired" } {
  const session = store.get(sessionId);
  if (!session) return { error: "unknown" };
  if (nowMs >= session.absoluteExpiryMs) {
    store.drop(sessionId);
    return { error: "expired" };
  }
  if (nowMs - session.lastSeenMs >= idleTimeoutMs) {
    store.drop(sessionId);
    return { error: "idle" };
  }
  session.lastSeenMs = nowMs;
  return { userId: session.userId };
}
