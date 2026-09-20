import { describe, expect, it } from "vitest";
import { acceptEvent } from "./impl";

describe("acceptEvent", () => {
  it("rejects an event replayed outside the tolerance window", () => {
    const seen = new Set<string>();

    expect(acceptEvent({ id: "evt_1", sentAtSeconds: 1_700_000_000 }, 1_700_000_060, seen)).toEqual({ accepted: true });
    expect(acceptEvent({ id: "evt_1", sentAtSeconds: 1_700_000_000 }, 1_700_000_060, seen)).toEqual({
      accepted: false,
      reason: "duplicate",
    });
    expect(acceptEvent({ id: "evt_2", sentAtSeconds: 1_700_000_000 }, 1_700_001_000, seen)).toEqual({
      accepted: false,
      reason: "outside tolerance",
    });
  });
});
