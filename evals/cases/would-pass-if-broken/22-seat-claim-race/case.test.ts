import { describe, expect, it } from "vitest";
import { SeatMap } from "./impl";

describe("SeatMap.claim", () => {
  it("refuses a second holder for a seat that is already taken", () => {
    const map = new SeatMap();
    map.add({ row: "C", number: 4, heldBy: null });

    expect(map.claim("C", 4, "user-1")).toBe(true);
    expect(map.claim("C", 4, "user-2")).toBe(false);
    expect(map.holderOf("C", 4)).toBe("user-1");
  });
});
