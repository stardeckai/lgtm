import { describe, expect, it } from "vitest";
import { nextBillingDate } from "./impl";

describe("nextBillingDate", () => {
  it("keeps a subscription on its anchor day through a short month", () => {
    expect(nextBillingDate(15, 2026, 0)).toBe("2026-01-15");
    expect(nextBillingDate(15, 2026, 1)).toBe("2026-02-15");
    expect(nextBillingDate(15, 2026, 2)).toBe("2026-03-15");
    expect(nextBillingDate(15, 2026, 3)).toBe("2026-04-15");
  });
});
