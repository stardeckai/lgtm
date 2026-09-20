import { describe, expect, it } from "vitest";
import { isSameLocalDay, localDay } from "./impl";

describe("localDay", () => {
  it("rolls over at local midnight, not at UTC midnight", () => {
    const beforeLocalMidnight = Date.UTC(2026, 2, 1, 16, 30);
    const afterLocalMidnight = Date.UTC(2026, 2, 1, 17, 30);

    expect(localDay(beforeLocalMidnight, 420)).toBe("2026-03-01");
    expect(localDay(afterLocalMidnight, 420)).toBe("2026-03-02");
    expect(isSameLocalDay(beforeLocalMidnight, afterLocalMidnight, 420)).toBe(false);
  });
});
