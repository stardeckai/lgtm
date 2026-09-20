export type ObjectRef = { orgId: string; kind: "avatar" | "export" | "attachment"; id: string; ext: string };

export function storageKey(ref: ObjectRef): string {
  if (!/^[a-z0-9_]+$/.test(ref.orgId)) throw new Error(`unsafe org id ${ref.orgId}`);
  if (ref.id.includes("/") || ref.id.includes("..")) throw new Error(`unsafe object id ${ref.id}`);
  return `orgs/${ref.orgId}/${ref.kind}/${ref.id}.${ref.ext}`;
}

export class ObjectStore {
  private objects = new Map<string, Buffer>();

  put(ref: ObjectRef, body: Buffer): string {
    const key = storageKey(ref);
    this.objects.set(key, body);
    return key;
  }

  get(orgId: string, key: string): Buffer | null {
    if (!key.startsWith(`orgs/${orgId}/`)) return null;
    return this.objects.get(key) ?? null;
  }
}
