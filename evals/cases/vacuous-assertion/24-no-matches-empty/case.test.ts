import { describe, expect, it } from "vitest";
import { overlapping, type Shift } from "./impl";

const roster: Shift[] = [
  { id: "s1", startMin: 540, endMin: 720, staffId: "emp-1" },
  { id: "s2", startMin: 720, endMin: 900, staffId: "emp-1" },
  { id: "s3", startMin: 600, endMin: 660, staffId: "emp-2" },
];

describe("overlapping", () => {
  it("treats a shift that starts exactly when another ends as free of conflicts", () => {
    expect(overlapping(roster, { id: "s2", startMin: 720, endMin: 900, staffId: "emp-1" })).toEqual([]);
    expect(
      overlapping(roster, { id: "s9", startMin: 700, endMin: 800, staffId: "emp-1" }).map((s) => s.id),
    ).toEqual(["s1", "s2"]);
  });
});
