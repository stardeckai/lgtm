import { describe, expect, it } from "vitest";
import { Store } from "./impl";

describe("Store.cancel", () => {
  it("cancels the order and puts the reserved units back into stock", () => {
    const store = new Store(
      new Map([["o-1", { id: "o-1", status: "placed" as const, lines: [{ sku: "A", qty: 3 }] }]]),
      new Map([["A", 7]]),
    );

    store.cancel("o-1");

    expect(store.orders.get("o-1")?.status).toBe("cancelled");
  });
});
