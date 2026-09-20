import { describe, expect, it } from "vitest";
import { nextBusinessDay } from "./impl";

describe("nextBusinessDay", () => {
  it("skips over the weekend when the next calendar day is a Saturday", () => {
    expect(nextBusinessDay("2026-03-03")).toBe("2026-03-04");
  });
});
