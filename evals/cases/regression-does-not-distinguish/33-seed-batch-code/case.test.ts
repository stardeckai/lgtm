import { describe, expect, it } from "vitest";
import { batchCode } from "./impl";

describe("batchCode", () => {
  it("builds the label printed on the seed packet", () => {
    expect(batchCode("lavender", "2026-04-18", 7)).toBe("LAV-2604-007");
    expect(batchCode("borage", "2026-11-02", 142)).toBe("BOR-2611-142");
  });

  it("refuses a harvest date it cannot split", () => {
    expect(() => batchCode("chamomile", "20260418", 1)).toThrow();
  });
});
