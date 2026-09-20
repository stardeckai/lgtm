import { describe, expect, it } from "vitest";
import { allocateCents } from "./impl";

describe("allocateCents", () => {
  it("distributes every cent with at most one cent between equal shares", () => {
    const parts = allocateCents(1000, [1, 1, 1]);

    expect(parts).toHaveLength(3);
    expect(parts.reduce((sum, value) => sum + value, 0)).toBe(1000);
    expect(Math.max(...parts) - Math.min(...parts)).toBe(1);
    expect(parts.every((value) => Number.isInteger(value))).toBe(true);
  });
});
