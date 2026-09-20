import { describe, expect, it } from "vitest";
import { NoteStore } from "./impl";

describe("NoteStore", () => {
  it("hides another tenant's notes from both list and direct lookup", () => {
    const store = new NoteStore();
    store.put({ id: "n1", tenantId: "acme", body: "ours" });
    store.put({ id: "n2", tenantId: "globex", body: "theirs" });

    expect(store.list("acme").map((note) => note.id)).toEqual(["n1"]);
    expect(store.get("acme", "n2")).toBeNull();
    expect(store.get("globex", "n2")?.body).toBe("theirs");
  });
});
