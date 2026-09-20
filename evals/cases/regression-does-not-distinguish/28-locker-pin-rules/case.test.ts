import { describe, expect, it } from "vitest";
import { isPinAcceptable } from "./impl";

describe("isPinAcceptable", () => {
  it("takes four distinct-enough digits and turns away the obvious pins", () => {
    expect(isPinAcceptable("5308")).toBe(true);
    expect(isPinAcceptable("1234")).toBe(false);
    expect(isPinAcceptable("7777")).toBe(false);
    expect(isPinAcceptable("53a8")).toBe(false);
    expect(isPinAcceptable("530")).toBe(false);
  });
});
