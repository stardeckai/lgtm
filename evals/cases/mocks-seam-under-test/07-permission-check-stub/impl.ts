export type Member = { userId: string; orgId: string; roles: string[] };

export interface PermissionChecker {
  can(member: Member, permission: string): boolean;
}

const REQUIRED: Record<string, string[]> = {
  "billing.read": ["owner", "billing_admin", "finance"],
  "billing.write": ["owner", "billing_admin"],
};

export const roleChecker: PermissionChecker = {
  can(member, permission) {
    const allowed = REQUIRED[permission] ?? [];
    return member.roles.some((role) => allowed.includes(role));
  },
};

export class Forbidden extends Error {
  constructor(permission: string) {
    super(`missing permission ${permission}`);
    this.name = "Forbidden";
  }
}

export async function openInvoices(
  checker: PermissionChecker,
  member: Member,
  list: () => Promise<string[]>,
): Promise<string[]> {
  if (!checker.can(member, "billing.read")) throw new Forbidden("billing.read");
  return list();
}
