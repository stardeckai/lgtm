import { describe, expect, it } from "vitest";
import { Forbidden, Notebook } from "./impl";

describe("Notebook.delete", () => {
  it("only lets the owner delete a note and leaves it intact for anyone else", () => {
    const notebook = new Notebook([{ id: "n-1", ownerId: "u-1", deleted: false }]);

    expect(() => notebook.delete("n-1", "u-2")).toThrow(Forbidden);
    expect(notebook.get("n-1")?.deleted).toBe(false);

    notebook.delete("n-1", "u-1");
    expect(notebook.get("n-1")?.deleted).toBe(true);
  });
});
