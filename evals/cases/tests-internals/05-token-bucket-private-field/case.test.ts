import { describe, expect, it } from "vitest";
import { TokenBuckets } from "./impl";

describe("TokenBuckets", () => {
  it("tracks each api key separately", () => {
    const buckets = new TokenBuckets(2, 0.001);

    buckets.consume("key-a", 0);
    buckets.consume("key-b", 0);

    expect((buckets as any)["buckets"].size).toBe(2);
    expect((buckets as any)["buckets"].get("key-a").tokens).toBe(1);
  });
});
