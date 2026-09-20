import { describe, expect, it } from "vitest";
import { findClashes, type Assignment } from "./impl";

describe("findClashes", () => {
  it("separates an overlap from a short rest and clears a rota that is exactly eleven hours apart", () => {
    const assignments: Assignment[] = [
      { staffId: "s1", startMin: 540, endMin: 900, role: "front" },
      { staffId: "s1", startMin: 840, endMin: 1200, role: "kitchen" },
      { staffId: "s2", startMin: 600, endMin: 960, role: "front" },
      { staffId: "s2", startMin: 1560, endMin: 1800, role: "close" },
      { staffId: "s3", startMin: 600, endMin: 960, role: "front" },
      { staffId: "s3", startMin: 1620, endMin: 1860, role: "close" },
    ];

    expect(findClashes(assignments)).toEqual([
      { kind: "overlap", staffId: "s1", a: "front", b: "kitchen" },
      { kind: "rest", staffId: "s2", gapMin: 600 },
    ]);
  });
});
