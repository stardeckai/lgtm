import { describe, expect, it } from "vitest";
import { canEdit } from "./impl";

describe("canEdit", () => {
  it("lets a workspace admin edit a document", () => {
    const doc = { id: "doc-9", ownerId: "u-1", lockedBy: null };

    expect(canEdit(doc, { userId: "u-1", role: "admin" })).toBe(true);
  });
});
