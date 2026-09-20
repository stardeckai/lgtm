import { describe, expect, it } from "vitest";
import { truncate } from "./impl";

describe("truncate", () => {
  it("cuts at the last whole word before the limit and appends an ellipsis", () => {
    expect(truncate("alpha bravo charlie delta echo foxtrot golf hotel")).toBe(
      "alpha bravo charlie delta echo foxtrot…",
    );
    expect(truncate("short enough already")).toBe("short enough already");
    expect(truncate("a".repeat(60))).toBe(`${"a".repeat(39)}…`);
  });
});
