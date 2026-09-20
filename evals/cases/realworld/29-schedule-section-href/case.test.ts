import { describe, expect, it } from "vitest";
import { groupSessionsHref } from "./impl";

describe("landing page session cards", () => {
  it("routes landing-page session cards to the focused schedule section", () => {
    expect(groupSessionsHref("en")).toBe("/en/schedule#group-sessions");
    expect(groupSessionsHref("fr")).toBe("/fr/schedule#group-sessions");
  });
});
