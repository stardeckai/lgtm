import { describe, expect, it } from "vitest";
import { DocumentTable, visibleDocuments } from "./impl";

describe("visibleDocuments", () => {
  it("never leaks another organisation's documents, even to an admin", () => {
    const table = new DocumentTable([
      { id: "d-1", orgId: "org-a", title: "Ours", visibility: "org", ownerId: "u-2" },
      { id: "d-2", orgId: "org-a", title: "Private", visibility: "private", ownerId: "u-2" },
      { id: "d-3", orgId: "org-b", title: "Theirs", visibility: "org", ownerId: "u-9" },
    ]);

    expect(visibleDocuments(table, { userId: "u-1", orgId: "org-a", role: "viewer" }).map((d) => d.id)).toEqual(["d-1"]);
    expect(visibleDocuments(table, { userId: "u-1", orgId: "org-a", role: "admin" }).map((d) => d.id)).toEqual(["d-1", "d-2"]);
    expect(visibleDocuments(table, null)).toEqual([]);
  });
});
