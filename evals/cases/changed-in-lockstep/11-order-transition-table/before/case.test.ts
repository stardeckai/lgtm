import { describe, expect, it } from "vitest";
import { transition } from "./impl";

describe("transition", () => {
  it("only allows the moves the order lifecycle permits", () => {
    expect(transition("placed", "shipped")).toBe("shipped");
    expect(transition("shipped", "delivered")).toBe("delivered");
    expect(() => transition("shipped", "cancelled")).toThrow();
    expect(() => transition("delivered", "shipped")).toThrow();
  });
});
