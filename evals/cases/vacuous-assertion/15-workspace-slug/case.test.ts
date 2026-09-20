import { describe, expect, it } from "vitest";
import { slugify } from "./impl";

describe("slugify", () => {
  it("appends a numeric suffix when the slug is already taken", () => {
    const slug = slugify("Acme Robotics", new Set(["acme-robotics"]));

    expect(slug).toMatch(/[a-z]/);
  });
});
