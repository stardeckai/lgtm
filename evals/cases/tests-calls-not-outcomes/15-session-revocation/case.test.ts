import { describe, expect, it, vi } from "vitest";
import { revokeOtherSessions, type Session, type SessionStore } from "./impl";

describe("revokeOtherSessions", () => {
  it("keeps the current session alive and revokes the rest", () => {
    const sessions: Session[] = [
      { id: "s-current", userId: "u-1", deviceId: "d-1", createdAt: 1 },
      { id: "s-old-a", userId: "u-1", deviceId: "d-2", createdAt: 2 },
      { id: "s-old-b", userId: "u-1", deviceId: "d-3", createdAt: 3 },
    ];
    const store: SessionStore = { listFor: () => sessions, revoke: vi.fn() };

    revokeOtherSessions(store, "u-1", "s-current");

    expect(store.revoke).toHaveBeenCalledWith(expect.any(String), "password-changed");
  });
});
