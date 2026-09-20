import { describe, expect, it } from "vitest";
import { localDayBoundsUtc } from "./impl";

describe("localDayBoundsUtc", () => {
  it("makes the spring-forward day 23 hours long in a zone that observes it", () => {
    const normal = localDayBoundsUtc("2024-03-01", "Europe/Berlin");
    expect(normal.endMs - normal.startMs).toBe(86_400_000);

    const springForward = localDayBoundsUtc("2024-03-31", "Europe/Berlin");
    expect(springForward.endMs - springForward.startMs).toBe(82_800_000);

    const fixedOffset = localDayBoundsUtc("2024-03-31", "Asia/Bangkok");
    expect(fixedOffset.endMs - fixedOffset.startMs).toBe(86_400_000);
  });
});
