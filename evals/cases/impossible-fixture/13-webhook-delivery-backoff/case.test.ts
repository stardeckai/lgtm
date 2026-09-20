import { describe, expect, it } from "vitest";
import { nextRetryDelayMs, type Delivery } from "./impl";

const pending: Delivery = {
  id: "dlv_8",
  endpoint: "https://hooks.example.com/orders",
  attempts: -1,
  lastStatus: 502,
} as Delivery;

describe("nextRetryDelayMs", () => {
  it("waits half a second before the very first retry", () => {
    expect(nextRetryDelayMs(pending)).toBe(500);
  });
});
