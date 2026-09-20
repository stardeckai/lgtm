import { describe, expect, it } from "vitest";
import { canAddSeat } from "./impl";

describe("canAddSeat", () => {
  it("stops a free workspace at its seat limit", () => {
    expect(canAddSeat({ id: "w1", plan: "free", seats: 2 })).toEqual({ allowed: true });
    expect(canAddSeat({ id: "w1", plan: "free", seats: 3 })).toEqual({ allowed: false, reason: "seat limit reached" });
  });
});
