export type User = { id: string; active: boolean };

export type Session = { id: string; userId: string; revokedAtMs: number | null };

export class Directory {
  constructor(
    private readonly users: User[],
    private readonly sessions: Session[],
  ) {}

  deactivate(userId: string, nowMs: number): void {
    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) throw new Error(`no such user: ${userId}`);
    user.active = false;
    for (const session of this.sessions) {
      if (session.userId === userId && session.revokedAtMs === null) {
        session.revokedAtMs = nowMs;
      }
    }
  }

  userOf(userId: string): User | undefined {
    return this.users.find((candidate) => candidate.id === userId);
  }

  sessionsOf(userId: string): Session[] {
    return this.sessions.filter((session) => session.userId === userId);
  }
}
