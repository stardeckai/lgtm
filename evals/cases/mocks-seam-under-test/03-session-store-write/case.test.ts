import { describe, expect, it, vi } from "vitest";
import { startSession, type SessionStore } from "./impl";

describe("startSession", () => {
  it("persists the new session so it can be looked up afterwards", async () => {
    const store: SessionStore = {
      put: vi.fn().mockResolvedValue(undefined),
      byId: vi.fn().mockResolvedValue({
        id: "sess_u9_x",
        userId: "u9",
        expiresAt: 1,
        ip: "10.0.0.1",
      }),
      deleteForUser: vi.fn().mockResolvedValue(0),
    };

    const session = await startSession(store, "u9", "10.0.0.1", 1_700_000_000_000, false);

    expect(store.put).toHaveBeenCalled();
    await expect(store.byId(session.id)).resolves.not.toBeNull();
  });
});
