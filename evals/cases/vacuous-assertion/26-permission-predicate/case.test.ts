import { describe, expect, it } from "vitest";
import { canDelete } from "./impl";

describe("canDelete", () => {
  it("lets an admin delete an unlocked resource but never a locked one", () => {
    const resource = { orgId: "org-1", ownerId: "u-owner", locked: false };
    const admin = { userId: "u-admin", role: "admin" as const, orgId: "org-1" };

    expect(canDelete(admin, resource)).toBe(true);
    expect(canDelete(admin, { ...resource, locked: true })).toBe(false);
    expect(canDelete({ ...admin, orgId: "org-2" }, resource)).toBe(false);
  });
});
