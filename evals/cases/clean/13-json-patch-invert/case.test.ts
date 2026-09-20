import { describe, expect, it } from "vitest";
import { applyPatch, invertPatch, type Doc, type Patch } from "./impl";

describe("invertPatch", () => {
  it("returns the document to its exact previous state, including keys that did not exist", () => {
    const before: Doc = { title: "Draft", assignee: "u1" };
    const patch: Patch[] = [
      { op: "set", path: "title", value: "Final" },
      { op: "remove", path: "assignee" },
      { op: "set", path: "dueDate", value: "2026-04-01" },
    ];

    const after = applyPatch(before, patch);
    const restored = applyPatch(after, invertPatch(before, patch));

    expect(after).toEqual({ title: "Final", dueDate: "2026-04-01" });
    expect(restored).toEqual(before);
    expect(Object.keys(restored)).toEqual(["title", "assignee"]);
  });
});
