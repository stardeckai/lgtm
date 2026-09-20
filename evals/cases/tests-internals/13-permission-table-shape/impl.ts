export type Role = "viewer" | "editor" | "admin" | "owner";
export type Permission = "read" | "write" | "invite" | "billing";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["read"],
  editor: ["read", "write"],
  admin: ["read", "write", "invite"],
  owner: ["read", "write", "invite", "billing"],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function highestRole(roles: Role[]): Role {
  const order: Role[] = ["viewer", "editor", "admin", "owner"];
  return roles.reduce((best, r) => (order.indexOf(r) > order.indexOf(best) ? r : best), "viewer");
}
