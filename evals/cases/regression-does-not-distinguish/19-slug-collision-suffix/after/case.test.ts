import { describe, expect, it } from "vitest";
import { SlugBook } from "./impl";

describe("SlugBook", () => {
  it("gives a colliding title its own slug", () => {
    const book = new SlugBook();

    expect(book.claim("Team Sync")).toBe("team-sync");
    expect(book.claim("Team sync!")).toBe("team-sync-2");
    expect(book.claim("team  SYNC")).toBe("team-sync-3");
  });
});
