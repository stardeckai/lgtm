import { describe, expect, test } from "vitest";
import { consumeFifo, type Layer } from "./impl";

describe("consumeFifo", () => {
  test("drains the oldest layers first and leaves the newest partially intact", () => {
    const layers: Layer[] = [
      { receivedAt: "2024-03-10", qty: 40, unitCents: 250 },
      { receivedAt: "2024-01-05", qty: 30, unitCents: 190 },
      { receivedAt: "2024-02-18", qty: 25, unitCents: 220 },
    ];

    const result = consumeFifo(layers, 70);

    expect(result.cogsCents).toBe(14_950);
    expect(result.remaining).toEqual([{ receivedAt: "2024-03-10", qty: 25, unitCents: 250 }]);
  });
});
