export type Claims = { sub: string; orgId: string; scopes: string[]; exp: number };

export interface DirectoryApi {
  membership(userId: string, orgId: string): Promise<{ roles: string[] } | null>;
}

const SCOPE_ROLES: Record<string, string[]> = {
  "reports:read": ["owner", "analyst", "finance"],
  "reports:export": ["owner", "finance"],
};

export class AccessDenied extends Error {
  constructor(readonly scope: string) {
    super(`denied ${scope}`);
  }
}

export async function authorize(
  api: DirectoryApi,
  claims: Claims,
  scope: string,
  nowSeconds: number,
): Promise<{ userId: string; roles: string[] }> {
  if (claims.exp <= nowSeconds) throw new AccessDenied(scope);
  if (!claims.scopes.includes(scope)) throw new AccessDenied(scope);
  const membership = await api.membership(claims.sub, claims.orgId);
  if (!membership) throw new AccessDenied(scope);
  const permitted = SCOPE_ROLES[scope] ?? [];
  if (!membership.roles.some((role) => permitted.includes(role))) throw new AccessDenied(scope);
  return { userId: claims.sub, roles: membership.roles };
}
