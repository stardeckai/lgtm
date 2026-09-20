export type Invite = { email: string; orgId: string; role: string; acceptedAt: string | null };

export class InviteRepository {
  private readonly rows: Invite[] = [];
  create(invite: Invite): void {
    const existing = this.rows.find(
      (row) => row.email === invite.email && row.orgId === invite.orgId && row.acceptedAt === null,
    );
    if (existing) throw new Error("an invite is already pending for this address");
    this.rows.push(invite);
  }
  pendingFor(orgId: string): Invite[] {
    return this.rows.filter((row) => row.orgId === orgId && row.acceptedAt === null);
  }
}

export interface Mailer {
  send(to: string, template: string, vars: Record<string, string>): Promise<void>;
}

export async function inviteMember(
  repo: InviteRepository,
  mailer: Mailer,
  email: string,
  orgId: string,
  role: string,
): Promise<void> {
  repo.create({ email: email.trim().toLowerCase(), orgId, role, acceptedAt: null });
  await mailer.send(email, "org-invite", { orgId, role });
}
