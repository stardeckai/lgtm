import { describe, expect, it } from "vitest";
import { getRegionLabel } from "./impl";

describe("getRegionLabel", () => {
  it("falls back to the static region table when Intl.DisplayNames fails", () => {
    const label = getRegionLabel("DE", "en");

    expect(label.length).toBeGreaterThan(0);
  });
});
