export type Member = { id: string; active: boolean };

export type Session = { id: string; memberId: string; revokedAtMs: number | null };

export class Org {
  constructor(
    readonly members: Member[],
    readonly sessions: Session[],
  ) {}

  suspend(memberId: string, nowMs: number): void {
    const member = this.members.find((candidate) => candidate.id === memberId);
    if (!member) throw new Error(`no such member: ${memberId}`);
    member.active = false;
    for (const session of this.sessions) {
      if (session.memberId === memberId && session.revokedAtMs === null) {
        session.revokedAtMs = nowMs;
      }
    }
  }
}
