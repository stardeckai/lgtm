export type OrgRole = "owner" | "editor" | "viewer";
export type OrgMember = { userId: string; role: OrgRole };

export class Organisation {
  constructor(private members: OrgMember[]) {}

  roleOf(userId: string): OrgRole | null {
    return this.members.find((member) => member.userId === userId)?.role ?? null;
  }

  changeRole(userId: string, role: OrgRole): OrgMember {
    const member = this.members.find((candidate) => candidate.userId === userId);
    if (!member) throw new Error(`${userId} is not a member`);
    const owners = this.members.filter((candidate) => candidate.role === "owner");
    if (member.role === "owner" && role !== "owner" && owners.length === 1) {
      throw new Error("an organisation must keep at least one owner");
    }
    member.role = role;
    return member;
  }
}
