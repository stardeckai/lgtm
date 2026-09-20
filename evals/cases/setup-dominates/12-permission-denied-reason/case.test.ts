import { describe, expect, it } from "vitest";
import { canPerform, type Role } from "./impl";

const ROLE_DEFINITIONS: { role: Role; label: string; grants: string[] }[] = [
  { role: "viewer", label: "Viewer", grants: ["read:project", "read:comment"] },
  { role: "editor", label: "Editor", grants: ["read:project", "write:project", "write:comment"] },
  { role: "admin", label: "Admin", grants: ["read:project", "write:project", "manage:member", "manage:webhook"] },
  { role: "owner", label: "Owner", grants: ["*"] },
];

const RESOURCE_TREE = {
  tenant: { id: "ten_8", name: "Pine Labs" },
  workspaces: [
    { id: "ws_1", name: "Design", projects: [{ id: "pr_1", name: "Rebrand" }, { id: "pr_2", name: "Icons" }] },
    { id: "ws_2", name: "Platform", projects: [{ id: "pr_3", name: "Gateway" }] },
  ],
};

const MEMBERSHIPS = ROLE_DEFINITIONS.map((definition, index) => ({
  userId: `usr_${index}`,
  tenantId: RESOURCE_TREE.tenant.id,
  role: definition.role,
  invitedBy: "usr_0",
  joinedAt: `2023-0${index + 1}-01T00:00:00.000Z`,
}));

describe("canPerform", () => {
  it("names the role that was missing when the actor is under-privileged", () => {
    const auditEntries = MEMBERSHIPS.flatMap((membership) =>
      RESOURCE_TREE.workspaces.flatMap((workspace) =>
        workspace.projects.map((project) => ({
          userId: membership.userId,
          projectId: project.id,
          action: "viewed",
          at: "2024-02-02T08:00:00.000Z",
        })),
      ),
    );
    const grantsByRole = new Map(ROLE_DEFINITIONS.map((d) => [d.role, d.grants]));

    expect(canPerform("editor", "admin", true)).toEqual({ allowed: false, reason: "requires_admin" });
  });
});
