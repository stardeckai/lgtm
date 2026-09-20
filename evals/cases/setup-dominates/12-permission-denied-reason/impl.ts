export type Role = "viewer" | "editor" | "admin" | "owner";
export type Decision = { allowed: boolean; reason: string };

const RANK: Record<Role, number> = { viewer: 0, editor: 1, admin: 2, owner: 3 };

export function canPerform(actorRole: Role, required: Role, sameTenant: boolean): Decision {
  if (!sameTenant) return { allowed: false, reason: "cross_tenant" };
  if (RANK[actorRole] < RANK[required]) return { allowed: false, reason: `requires_${required}` };
  return { allowed: true, reason: "granted" };
}
