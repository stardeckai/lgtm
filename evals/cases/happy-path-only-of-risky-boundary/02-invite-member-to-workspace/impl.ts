export type Role = "owner" | "admin" | "member" | "viewer";
export type Membership = { workspaceId: string; userId: string; role: Role };

export class Workspace {
  private memberships: Membership[] = [];

  seed(memberships: Membership[]): void {
    this.memberships = [...memberships];
  }

  roleOf(userId: string): Role | null {
    return this.memberships.find((m) => m.userId === userId)?.role ?? null;
  }

  invite(actorId: string, inviteeId: string, role: Role): Membership {
    const actorRole = this.roleOf(actorId);
    if (actorRole !== "owner" && actorRole !== "admin") {
      throw new Error("only owners and admins can invite");
    }
    if (role === "owner" && actorRole !== "owner") {
      throw new Error("only an owner can grant ownership");
    }
    if (this.roleOf(inviteeId)) throw new Error("already a member");
    const membership = { workspaceId: "ws_1", userId: inviteeId, role };
    this.memberships.push(membership);
    return membership;
  }
}
