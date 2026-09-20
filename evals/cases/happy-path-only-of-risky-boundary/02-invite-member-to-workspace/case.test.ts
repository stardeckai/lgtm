import { describe, expect, it } from "vitest";
import { Workspace } from "./impl";

describe("Workspace.invite", () => {
  it("adds the invitee with the role the admin chose", () => {
    const workspace = new Workspace();
    workspace.seed([{ workspaceId: "ws_1", userId: "usr_admin", role: "admin" }]);

    const membership = workspace.invite("usr_admin", "usr_new", "member");

    expect(membership).toEqual({ workspaceId: "ws_1", userId: "usr_new", role: "member" });
    expect(workspace.roleOf("usr_new")).toBe("member");
  });

  it("lets an owner invite a viewer", () => {
    const workspace = new Workspace();
    workspace.seed([{ workspaceId: "ws_1", userId: "usr_owner", role: "owner" }]);

    expect(workspace.invite("usr_owner", "usr_v", "viewer").role).toBe("viewer");
  });

  it("returns the membership row it stored", () => {
    const workspace = new Workspace();
    workspace.seed([{ workspaceId: "ws_1", userId: "usr_owner", role: "owner" }]);

    const membership = workspace.invite("usr_owner", "usr_x", "admin");

    expect(workspace.roleOf(membership.userId)).toBe("admin");
  });
});
