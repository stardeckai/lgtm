import { describe, expect, it, vi } from "vitest";
import { saveArticle, type Article, type ArticleRepository, type SearchIndex } from "./impl";

const article: Article = { id: "a-4", title: "Roasting", body: "beans and time", published: true };

describe("saveArticle", () => {
  it("makes a published article findable in search", async () => {
    const repo: ArticleRepository = {
      save: vi.fn().mockResolvedValue(undefined),
      byId: vi.fn().mockResolvedValue(article),
    };
    const index: SearchIndex = {
      upsert: vi.fn().mockResolvedValue(undefined),
      remove: vi.fn().mockResolvedValue(undefined),
      search: vi.fn().mockResolvedValue(["a-4"]),
    };

    await saveArticle(repo, index, article);

    await expect(index.search("roasting")).resolves.toEqual(["a-4"]);
  });
});
