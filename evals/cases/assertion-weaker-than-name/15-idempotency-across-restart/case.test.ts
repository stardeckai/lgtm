import { describe, expect, it } from "vitest";
import { IdempotencyStore } from "./impl";

describe("IdempotencyStore.remember", () => {
  it("keeps returning the first result for a key even after the process restarts", () => {
    const store = new IdempotencyStore(new Map());

    expect(store.remember("k-1", "r-1")).toBe("r-1");
    expect(store.remember("k-1", "r-2")).toBe("r-1");
  });
});
