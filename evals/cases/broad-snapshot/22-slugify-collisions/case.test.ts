import { describe, expect, test } from "vitest";
import { uniqueSlugs } from "./impl";

describe("uniqueSlugs", () => {
  test("suffixes later collisions and counts from two", () => {
    expect(uniqueSlugs(["Café Life", "Cafe life!", "CAFE LIFE", "Other"])).toMatchInlineSnapshot(`
      [
        "cafe-life",
        "cafe-life-2",
        "cafe-life-3",
        "other",
      ]
    `);
  });
});
