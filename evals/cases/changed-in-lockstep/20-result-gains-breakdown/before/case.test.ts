import { describe, expect, it } from "vitest";
import { stayTotalCents } from "./impl";

describe("stayTotalCents", () => {
  it("charges the cleaning fee once however many nights are booked", () => {
    expect(stayTotalCents({ nights: 3, nightlyCents: 9000, cleaningCents: 4500 })).toBe(31500);
    expect(stayTotalCents({ nights: 1, nightlyCents: 9000, cleaningCents: 4500 })).toBe(13500);
  });
});
