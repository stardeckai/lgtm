import { describe, expect, it, vi } from "vitest";
import { projectResolver, type Context } from "./impl";

describe("projectResolver.project", () => {
  it("returns the project with its deployments", async () => {
    const ctx: Context = {
      loaders: { projectById: { load: vi.fn().mockResolvedValue({ id: "p-1", orgId: "o-1", name: "Tracker" }) } },
      permissions: { canRead: vi.fn().mockResolvedValue(true) },
      db: { listDeployments: vi.fn().mockResolvedValue([]) },
      log: vi.fn(),
    };

    const result = await projectResolver.project(null, { id: "p-1" }, ctx);

    expect(result).toMatchObject({ id: "p-1", name: "Tracker" });
  });
});
