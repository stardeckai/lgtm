import { describe, expect, it } from "vitest";
import { articleSlug } from "./impl";

describe("articleSlug", () => {
  it("strips accents and collapses punctuation into single hyphens", () => {
    const title = "Crème Brûlée: 10 Tips — for Café Owners!";

    const expected = title
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "");

    expect(articleSlug(title)).toBe(expected);
  });
});
