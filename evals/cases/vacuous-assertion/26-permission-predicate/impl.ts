export type Role = "viewer" | "member" | "admin" | "owner";

export type Actor = { userId: string; role: Role; orgId: string };

export type Resource = { orgId: string; ownerId: string; locked: boolean };

const RANK: Record<Role, number> = { viewer: 0, member: 1, admin: 2, owner: 3 };

export function canDelete(actor: Actor, resource: Resource): boolean {
  if (actor.orgId !== resource.orgId) return false;
  if (resource.locked) return RANK[actor.role] >= RANK.owner;
  if (actor.userId === resource.ownerId) return true;
  return RANK[actor.role] >= RANK.admin;
}
