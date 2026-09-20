import { describe, expect, it } from "vitest";
import { Thread } from "./impl";

describe("Thread.delete", () => {
  it("only lets the author of a comment delete it", () => {
    const thread = new Thread([
      { id: "c-1", authorId: "u-1", body: "hello", deleted: false },
    ]);

    expect(thread.delete("c-1", "u-1", false)).toBe(true);
    expect(thread.find("c-1")?.deleted).toBe(true);
  });
});
