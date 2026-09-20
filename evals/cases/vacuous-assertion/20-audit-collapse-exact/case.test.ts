import { describe, expect, it } from "vitest";
import { Trail } from "./impl";

describe("Trail.record", () => {
  it("keeps one entry for a burst inside a second and a second entry after it", () => {
    const trail = new Trail();
    trail.record({ actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 5_000 });
    trail.record({ actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 5_400 });
    trail.record({ actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 6_500 });

    expect(trail.all()).toEqual([
      { actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 5_000 },
      { actorId: "u-1", action: "role.grant", targetId: "u-2", atMs: 6_500 },
    ]);
  });
});
