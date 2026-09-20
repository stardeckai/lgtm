export type Grant = { subject: string; resource: string; permission: string; viaGroup?: string };

export class AccessStore {
  private grants: Grant[] = [];
  private groupMembers = new Map<string, Set<string>>();

  addToGroup(group: string, subject: string): void {
    const members = this.groupMembers.get(group) ?? new Set<string>();
    members.add(subject);
    this.groupMembers.set(group, members);
  }

  grantToGroup(group: string, resource: string, permission: string): void {
    for (const subject of this.groupMembers.get(group) ?? []) {
      this.grants.push({ subject, resource, permission, viaGroup: group });
    }
  }

  grantDirect(subject: string, resource: string, permission: string): void {
    this.grants.push({ subject, resource, permission });
  }

  removeFromGroup(group: string, subject: string): void {
    this.groupMembers.get(group)?.delete(subject);
    this.grants = this.grants.filter((g) => !(g.viaGroup === group && g.subject === subject));
  }

  can(subject: string, resource: string, permission: string): boolean {
    return this.grants.some((g) => g.subject === subject && g.resource === resource && g.permission === permission);
  }
}
