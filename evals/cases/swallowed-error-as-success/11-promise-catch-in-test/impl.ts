export type Tenant = { id: string; plan: "free" | "pro" };
export type Store = { find(id: string): Promise<Tenant | null> };

export async function requirePro(store: Store, tenantId: string): Promise<Tenant> {
  const tenant = await store.find(tenantId);
  if (!tenant) throw new Error("tenant_not_found");
  if (tenant.plan !== "pro") throw new Error("upgrade_required");
  return tenant;
}
