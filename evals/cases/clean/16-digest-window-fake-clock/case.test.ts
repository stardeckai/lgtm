import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AlertBuffer } from "./impl";

describe("AlertBuffer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-01T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("emits one line per key with the repeat count once its window has closed", () => {
    const buffer = new AlertBuffer(60_000);

    buffer.observe({ key: "disk", text: "disk almost full" }, Date.now());
    buffer.observe({ key: "disk", text: "disk almost full" }, Date.now());
    vi.advanceTimersByTime(30_000);
    buffer.observe({ key: "cpu", text: "cpu saturated" }, Date.now());

    expect(buffer.flush(Date.now())).toEqual([]);

    vi.advanceTimersByTime(30_000);
    expect(buffer.flush(Date.now())).toEqual([{ key: "disk", text: "disk almost full", count: 2 }]);

    vi.advanceTimersByTime(30_000);
    expect(buffer.flush(Date.now())).toEqual([{ key: "cpu", text: "cpu saturated", count: 1 }]);
  });
});
