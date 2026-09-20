import { describe, expect, it } from "vitest";
import { parkingFeeCents } from "./impl";

describe("parkingFeeCents", () => {
  it("prices the first quarter hour free, then by started hour up to the daily cap", () => {
    expect(parkingFeeCents(15)).toBe(0);
    expect(parkingFeeCents(16)).toBe(200);
    expect(parkingFeeCents(61)).toBe(350);
    expect(parkingFeeCents(600)).toBe(1500);
  });

  it("charges a full hour for a stay that runs one minute into it", () => {
    expect(parkingFeeCents(121)).toBe(500);
  });

  it("treats a zero-minute stay as free", () => {
    expect(parkingFeeCents(0)).toBe(0);
  });
});
