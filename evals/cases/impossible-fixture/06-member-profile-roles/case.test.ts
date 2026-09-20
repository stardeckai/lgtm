import { describe, expect, it } from "vitest";
import { membershipSummary, type Member } from "./impl";

describe("membershipSummary", () => {
  it("falls back to the invite date for an active member", () => {
    const member = {
      id: "m_3",
      displayName: "Rae Tan",
      status: "active",
      invitedAt: "2021-08-02T09:00:00.000Z",
    } as unknown as Member;

    expect(membershipSummary(member)).toBe("Rae Tan joined 2021-08-02");
  });
});
