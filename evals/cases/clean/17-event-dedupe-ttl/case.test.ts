import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ingest, SeenEvents } from "./impl";

describe("ingest", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("drops a repeat inside the window and lets the same id through once it has aged out", () => {
    vi.setSystemTime(new Date("2026-07-01T12:00:00Z"));
    const dedupe = new SeenEvents(5 * 60_000);

    expect(ingest(dedupe, ["a", "b", "a"], Date.now())).toEqual(["a", "b"]);

    vi.advanceTimersByTime(4 * 60_000);
    expect(ingest(dedupe, ["a"], Date.now())).toEqual([]);
    expect(dedupe.size(Date.now())).toBe(2);

    vi.advanceTimersByTime(2 * 60_000);
    expect(ingest(dedupe, ["a"], Date.now())).toEqual(["a"]);
    expect(dedupe.size(Date.now())).toBe(1);
  });
});
