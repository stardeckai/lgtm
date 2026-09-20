import { describe, expect, it } from "vitest";
import { statusLabel } from "./impl";

describe("statusLabel", () => {
  it("returns the human label for each status", () => {
    expect(statusLabel("draft")).toBe("Draft");
    expect(statusLabel("placed")).toBe("Placed");
    expect(statusLabel("packed")).toBe("Packed");
    expect(statusLabel("shipped")).toBe("Shipped");
  });
});
