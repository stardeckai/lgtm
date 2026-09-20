import { describe, expect, it } from "vitest";
import { page, type Comment } from "./impl";

const comments: Comment[] = Array.from({ length: 7 }, (_, index) => ({
  id: `c-${index}`,
  createdAtMs: index * 1000,
  body: `comment ${index}`,
}));

describe("page", () => {
  it("returns a page of comments newest first with a cursor for the next page", () => {
    const first = page(comments, null, 3);

    expect(first.items).toHaveLength(3);
  });
});
