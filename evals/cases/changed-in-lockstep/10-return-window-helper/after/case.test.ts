import { describe, expect, it } from "vitest";
import { canReturn } from "./impl";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("canReturn", () => {
  it("accepts a return inside the window and refuses one after it", () => {
    const shipment = { orderId: "o-1", deliveredAtMs: Date.UTC(2026, 0, 1) };

    expect(canReturn(shipment, shipment.deliveredAtMs + 14 * DAY_MS)).toBe(true);
    expect(canReturn(shipment, shipment.deliveredAtMs + 15 * DAY_MS)).toBe(false);
  });
});
