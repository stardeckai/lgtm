export type Session = { id: string; userId: string; deviceId: string; createdAt: number };

export interface SessionStore {
  listFor(userId: string): Session[];
  revoke(sessionId: string, reason: string): void;
}

export function revokeOtherSessions(
  store: SessionStore,
  userId: string,
  keepSessionId: string,
): number {
  const sessions = store.listFor(userId);
  let revoked = 0;
  for (const session of sessions) {
    if (session.id === keepSessionId) continue;
    store.revoke(session.id, "password-changed");
    revoked++;
  }
  return revoked;
}
