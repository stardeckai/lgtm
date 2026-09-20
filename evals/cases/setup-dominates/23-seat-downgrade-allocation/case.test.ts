import { describe, expect, it } from "vitest";
import { planDowngrade, type Member } from "./impl";

describe("planDowngrade", () => {
  it("keeps the owner and then the most recently active members, deactivating the rest", () => {
    const members: Member[] = [
      { id: "m_stale_member", role: "member", lastActiveAt: "2024-01-02T00:00:00.000Z" },
      { id: "m_owner", role: "owner", lastActiveAt: "2023-11-01T00:00:00.000Z" },
      { id: "m_fresh_member", role: "member", lastActiveAt: "2024-06-01T00:00:00.000Z" },
      { id: "m_admin", role: "admin", lastActiveAt: "2024-02-01T00:00:00.000Z" },
    ];

    expect(planDowngrade(members, 3)).toEqual({
      keep: ["m_owner", "m_admin", "m_fresh_member"],
      deactivate: ["m_stale_member"],
    });
    expect(() => planDowngrade(members, 0)).toThrow("at least one seat is required");
  });
});
