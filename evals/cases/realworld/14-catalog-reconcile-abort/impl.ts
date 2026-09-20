export class ReconcileError extends Error {}

export type Entry = { key: string; label: string; deletedAt: string | null };

export class CatalogStore {
  entries: Entry[] = [];
  grants: { roleId: string; key: string }[] = [];

  transaction<T>(fn: () => T): T {
    const entries = this.entries.map((e) => ({ ...e }));
    const grants = this.grants.map((g) => ({ ...g }));
    try {
      return fn();
    } catch (error) {
      this.entries = entries;
      this.grants = grants;
      throw error;
    }
  }
}

export function reconcileCatalog(store: CatalogStore, manifest: { key: string; label: string }[], strict: boolean) {
  return store.transaction(() => {
    for (const item of manifest) {
      const existing = store.entries.find((e) => e.key === item.key);
      if (existing) existing.label = item.label;
      else store.entries.push({ key: item.key, label: item.label, deletedAt: null });
    }
    const keys = new Set(manifest.map((i) => i.key));
    for (const entry of store.entries) {
      if (keys.has(entry.key) || entry.deletedAt) continue;
      if (strict && store.grants.some((g) => g.key === entry.key)) {
        throw new ReconcileError(`${entry.key} is still granted to a role`);
      }
      entry.deletedAt = "2024-04-01T00:00:00Z";
    }
    return store.entries.length;
  });
}
