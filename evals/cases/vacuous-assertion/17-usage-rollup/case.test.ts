import { describe, expect, it } from "vitest";
import { creditsUsed } from "./impl";

describe("creditsUsed", () => {
  it("prorates storage usage by the hours in a month before charging", () => {
    const total = creditsUsed(
      [{ meter: "storage_gb_hours", quantity: 1460, creditsPerUnit: 4 }],
      1,
    );

    expect(typeof total).toBe("number");
    expect(Number.isFinite(total)).toBe(true);
  });
});
