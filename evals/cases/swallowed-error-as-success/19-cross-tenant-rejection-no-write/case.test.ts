import { describe, expect, it } from "vitest";
import { AuthorizationError, ProjectService, type Project } from "./impl";

describe("ProjectService", () => {
  it("refuses a rename from another tenant before it checks the role", () => {
    const projects = new Map<string, Project>([["pr_1", { id: "pr_1", tenantId: "ten_a", name: "Atlas" }]]);
    const service = new ProjectService(projects);
    const outsider = { id: "usr_9", tenantId: "ten_b", role: "admin" as const };

    expect(() => service.rename(outsider, "pr_1", "Renamed")).toThrow(
      new AuthorizationError("TENANT_MISMATCH"),
    );
    expect(projects.get("pr_1")!.name).toBe("Atlas");
  });
});
