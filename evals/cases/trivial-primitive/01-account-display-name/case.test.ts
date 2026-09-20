import { describe, expect, it } from "vitest";
import { displayName } from "./impl";

describe("displayName", () => {
  it("joins the first and last name with a space", () => {
    expect(displayName({ firstName: "Ada", lastName: "Lovelace", email: "ada@example.com" })).toBe(
      "Ada Lovelace",
    );
  });
});
