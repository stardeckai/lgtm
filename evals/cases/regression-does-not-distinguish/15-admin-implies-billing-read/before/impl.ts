export type Role = "owner" | "admin" | "member";
export type Member = { userId: string; role: Role; grants: string[] };

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner: ["billing:read", "billing:write", "member:invite"],
  admin: ["member:invite"],
  member: [],
};

export function can(member: Member, permission: string): boolean {
  if (member.grants.includes(permission)) return true;
  return ROLE_PERMISSIONS[member.role].includes(permission);
}
