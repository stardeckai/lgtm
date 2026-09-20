import { describe, expect, it } from "vitest";
import { slugify } from "./impl";

describe("slugify", () => {
  it("strips accents and punctuation without leaving stray hyphens", () => {
    expect(slugify("Crème brûlée — l'été!")).toBe("creme-brulee-lete");
    expect(slugify("  --Hello,  World--  ")).toBe("hello-world");
    expect(slugify("A".repeat(59) + " tail")).toBe("a".repeat(59));
  });
});
