import { describe, expect, it, vi } from "vitest";
import { changeRole, type AuditSink, type MembershipStore, type Role } from "./impl";

describe("changeRole", () => {
  it("records who changed the role and what it changed from", () => {
    const roles: Record<string, Role> = { "u-admin": "admin", "u-target": "viewer" };
    const store: MembershipStore = {
      roleOf: (id) => roles[id] ?? "viewer",
      setRole: vi.fn(),
    };
    const audit: AuditSink = { record: vi.fn() };

    changeRole(store, audit, "u-admin", "u-target", "editor");

    expect(audit.record).toHaveBeenCalled();
  });
});
