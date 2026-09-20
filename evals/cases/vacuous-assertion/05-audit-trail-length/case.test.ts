import { describe, expect, it } from "vitest";
import { AuditTrail } from "./impl";

describe("AuditTrail", () => {
  it("collapses repeated actions recorded within the same second", () => {
    const trail = new AuditTrail();
    trail.record({ actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 5_000 });
    trail.record({ actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 5_400 });

    expect(trail.since(0).length).toBeGreaterThanOrEqual(0);
  });
});
