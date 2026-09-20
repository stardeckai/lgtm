import { describe, expect, it } from "vitest";
import { reserve } from "./impl";

describe("reserve", () => {
  it("never reserves more units than the warehouse actually has available", () => {
    const result = reserve({ sku: "LAMP-1", onHand: 12, reserved: 2 }, 3);

    expect(result).toEqual({ sku: "LAMP-1", reservedQty: 3, remaining: 7 });
  });
});
