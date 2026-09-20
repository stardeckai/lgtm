import { describe, expect, it } from "vitest";
import { pluralise } from "./impl";

describe("pluralise", () => {
  it("adds an s to the noun for anything other than one", () => {
    expect(pluralise(1, "message")).toBe("1 message");
    expect(pluralise(3, "message")).toBe("3 messages");
  });
});
