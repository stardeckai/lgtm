import { describe, expect, it } from "vitest";
import { slugify } from "./impl";

describe("slugify", () => {
  it("truncates an over-long title to the storage limit", () => {
    const title = "a".repeat(100);

    expect(slugify(title)).toHaveLength(60);
    expect(slugify("Release Notes")).toBe("release-notes");
  });
});
