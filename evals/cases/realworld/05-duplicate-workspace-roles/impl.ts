import { createApp, createPermission, createRole, listPermissions, listRoles, setRolePermissions } from "./store";
import { forkRepository } from "./repository";
import { uniqueSlug } from "./slug";

export type DuplicateInput = { name?: string; slug?: string };

export async function duplicateApp(ownerId: string, workspaceId: string, sourceAppId: string, input: DuplicateInput) {
  const slug = input.slug ?? (await uniqueSlug(workspaceId, sourceAppId));
  const repository = await forkRepository(sourceAppId, slug);
  const app = await createApp({ workspaceId, ownerId, name: input.name ?? slug, slug, repository });

  const sourcePermissions = await listPermissions(sourceAppId);
  const permissionIdMap = new Map<string, string>();
  for (const permission of sourcePermissions) {
    if (permission.deletedAt) continue;
    const created = await createPermission({ appId: app.id, name: permission.name, key: permission.key });
    permissionIdMap.set(permission.id, created.id);
  }

  for (const role of await listRoles(sourceAppId)) {
    const created = await createRole({ appId: app.id, name: role.name, key: role.key });
    const mapped = role.permissionIds.map((id) => permissionIdMap.get(id)).filter((id): id is string => !!id);
    await setRolePermissions(created.id, mapped);
  }
  return app;
}
