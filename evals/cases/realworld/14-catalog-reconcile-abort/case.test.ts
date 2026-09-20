import { describe, expect, it } from "vitest";
import { CatalogStore, ReconcileError, reconcileCatalog } from "./impl";

const MANIFEST = [
  { key: "reports.read", label: "Read reports" },
  { key: "reports.export", label: "Export reports" },
  { key: "reports.admin", label: "Administer reports" },
];

describe("reconcileCatalog", () => {
  it("aborts in strict mode when a removed entry still has live role grants", () => {
    const store = new CatalogStore();
    reconcileCatalog(store, MANIFEST, true);
    store.grants.push({ roleId: "role_admin", key: "reports.admin" });

    expect(() => reconcileCatalog(store, MANIFEST.slice(0, 2), true)).toThrow(ReconcileError);

    const admin = store.entries.find((e) => e.key === "reports.admin");
    expect(admin?.deletedAt).toBeNull();
    expect(store.entries.map((e) => e.key)).toEqual([
      "reports.read",
      "reports.export",
      "reports.admin",
    ]);
  });
});
