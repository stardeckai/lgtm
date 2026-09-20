import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { authenticate, SessionStore } from "./impl";

describe("authenticate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-10T08:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("keeps an active session alive but drops it at the absolute lifetime even while in use", () => {
    const store = new SessionStore();
    store.create("s1", "u1", Date.now(), 60 * 60_000);
    const idle = 15 * 60_000;

    vi.advanceTimersByTime(10 * 60_000);
    expect(authenticate(store, "s1", Date.now(), idle)).toEqual({ userId: "u1" });

    vi.advanceTimersByTime(10 * 60_000);
    expect(authenticate(store, "s1", Date.now(), idle)).toEqual({ userId: "u1" });

    vi.advanceTimersByTime(40 * 60_000);
    expect(authenticate(store, "s1", Date.now(), idle)).toEqual({ error: "expired" });
    expect(store.get("s1")).toBeUndefined();
    expect(authenticate(store, "s1", Date.now(), idle)).toEqual({ error: "unknown" });
  });
});
