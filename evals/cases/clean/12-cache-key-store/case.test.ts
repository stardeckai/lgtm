import { describe, expect, it } from "vitest";
import { MemoCache } from "./impl";

describe("MemoCache", () => {
  it("treats reordered filters as the same entry but never shares across organisations", () => {
    const cache = new MemoCache<string>();
    let loads = 0;
    const load = (label: string) => () => {
      loads += 1;
      return label;
    };

    expect(cache.read({ orgId: "org_a", entity: "orders", filters: { status: "open", limit: 10 } }, load("a"))).toBe("a");
    expect(cache.read({ orgId: "org_a", entity: "orders", filters: { limit: 10, status: "open" } }, load("b"))).toBe("a");
    expect(cache.read({ orgId: "org_b", entity: "orders", filters: { status: "open", limit: 10 } }, load("c"))).toBe("c");

    expect(loads).toBe(2);
    expect(cache.hitCount()).toBe(1);
  });
});
