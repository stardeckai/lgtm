export type Role = "owner" | "admin" | "member" | "viewer";
export type Invite = { email: string; role: Role; invitedBy: string };

export function buildInvite(email: string, invitedBy: string, role?: Role): Invite {
  return { email: email.trim().toLowerCase(), role: role ?? "member", invitedBy };
}
