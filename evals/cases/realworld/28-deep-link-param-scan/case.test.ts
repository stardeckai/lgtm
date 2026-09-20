import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SOURCE = fs.readFileSync(path.join(import.meta.dirname, "impl.ts"), "utf8");

describe("every check-in deep link clears on reset", () => {
  it("clears every deep-link param on reset, not just the first one", () => {
    expect(SOURCE).not.toMatch(/next\.delete\(\s*["']ticket["']\s*\)/);
    expect(SOURCE).toMatch(/DESK_DEEP_LINK_PARAMS\b[\s\S]{0,120}next\.delete\(/);
  });
});
