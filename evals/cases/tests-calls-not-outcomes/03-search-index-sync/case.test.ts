import { describe, expect, it, vi } from "vitest";
import { syncArticle, type SearchIndex } from "./impl";

describe("syncArticle", () => {
  it("indexes a published article", async () => {
    const index: SearchIndex = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
    };

    await syncArticle(index, {
      id: "a-7",
      title: "Release notes",
      body: "x".repeat(400),
      status: "published",
      tags: ["Ops", "Release"],
    });

    expect(index.upsert).toHaveBeenCalled();
  });
});
