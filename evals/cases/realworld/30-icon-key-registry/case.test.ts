import { describe, expect, it } from "vitest";
import { ICON_REGISTRY, resolveSessionIcon } from "./impl";

describe("session icon preview", () => {
  it("prefers an explicit icon selection over the session name", () => {
    expect(resolveSessionIcon("briefing", "Morning Workshop")).toBe(ICON_REGISTRY.briefing);
  });
});
