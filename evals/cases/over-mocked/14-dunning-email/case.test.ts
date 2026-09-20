import { describe, expect, it, vi } from "vitest";
import { dunningEmail } from "./impl";

vi.mock("./eligibility", () => ({ isEligibleForDunning: vi.fn().mockReturnValue(true) }));
vi.mock("./attempts", () => ({ attemptsFor: vi.fn().mockReturnValue(4) }));

describe("dunningEmail", () => {
  it("escalates to a final notice once the earlier attempts have failed", () => {
    const email = dunningEmail(
      { id: "a-1", email: "owner@example.com", pastDueCents: 45_000, graceDaysLeft: 2 },
      new Date("2024-11-01T00:00:00.000Z"),
    );

    expect(email?.subject).toBe("Final notice: ฿450.00 past due");
  });
});
