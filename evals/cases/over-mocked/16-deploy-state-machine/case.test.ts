import { describe, expect, it, vi } from "vitest";
import { Deploy } from "./impl";

describe("Deploy", () => {
  it("ignores a late build error once the deploy is already live", () => {
    const clock = vi.fn().mockReturnValue(new Date("2024-12-01T00:00:00.000Z"));
    const deploy = new Deploy(clock);

    deploy.apply({ type: "start" });
    deploy.apply({ type: "built" });

    expect(deploy.apply({ type: "error", message: "late worker crash" })).toBe("live");
    expect(deploy.history.map((h) => h.state)).toEqual(["queued", "building", "live"]);
    expect(deploy.apply({ type: "rollback" })).toBe("rolled-back");
  });
});
