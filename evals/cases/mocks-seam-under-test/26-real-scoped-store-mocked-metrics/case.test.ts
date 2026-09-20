import { describe, expect, it, vi } from "vitest";
import { NoteStore, visibleNotes, type Metrics } from "./impl";

const metrics: Metrics = { count: vi.fn() };

describe("visibleNotes", () => {
  it("shows a non-admin only their own notes and never another workspace's", () => {
    const store = new NoteStore();
    store.insert({ id: "n1", workspaceId: "w1", authorId: "u1", text: "mine" });
    store.insert({ id: "n2", workspaceId: "w1", authorId: "u2", text: "theirs" });
    store.insert({ id: "n3", workspaceId: "w2", authorId: "u1", text: "other workspace" });

    expect(visibleNotes(store, metrics, "w1", "u1", false).map((n) => n.id)).toEqual(["n1"]);
    expect(visibleNotes(store, metrics, "w1", "u1", true).map((n) => n.id)).toEqual(["n1", "n2"]);
  });
});
