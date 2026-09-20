import { describe, expect, it } from "vitest";
import { stayTotalCents } from "./impl";

describe("stayTotalCents", () => {
  it("charges the cleaning fee once however many nights are booked", () => {
    expect(stayTotalCents({ nights: 3, nightlyCents: 9000, cleaningCents: 4500 })).toEqual({
      totalCents: 31500,
      lodgingCents: 27000,
      cleaningCents: 4500,
    });
    expect(stayTotalCents({ nights: 1, nightlyCents: 9000, cleaningCents: 4500 }).totalCents).toBe(13500);
  });
});
