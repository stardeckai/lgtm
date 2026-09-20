import { describe, expect, it } from "vitest";
import { withDefaults } from "./impl";

describe("withDefaults", () => {
  it("keeps the supplied values and fills in the rest", () => {
    expect(withDefaults({ theme: "dark" })).toEqual({
      theme: "dark",
      position: "right",
      greeting: "Hi there",
      showAvatar: true,
    });
  });
});
