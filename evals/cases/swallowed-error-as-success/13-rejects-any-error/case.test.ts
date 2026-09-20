import { describe, expect, it } from "vitest";
import { LeaseStore } from "./impl";

describe("LeaseStore", () => {
  it("refuses a second holder while the lease is still live", async () => {
    const store = new LeaseStore();
    await store.acquire("branch:main", "worker_a", 1_000, 30_000);

    await expect(store.acquire("branch:main", "worker_b", 5_000, 30_000)).rejects.toThrow();
  });
});
