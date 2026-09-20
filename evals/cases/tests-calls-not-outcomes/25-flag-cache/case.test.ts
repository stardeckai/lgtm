import { describe, expect, it, vi } from "vitest";
import { FlagClient, type FlagBackend } from "./impl";

describe("FlagClient", () => {
  it("serves the cached variant until the ttl expires, then refetches", async () => {
    const backend: FlagBackend = {
      fetch: vi
        .fn()
        .mockResolvedValueOnce({ variant: "treatment", ttlMs: 1_000 })
        .mockResolvedValueOnce({ variant: "control", ttlMs: 1_000 }),
    };
    let clock = 0;
    const client = new FlagClient(backend, () => clock);

    expect(await client.variantFor("new-nav")).toBe("treatment");
    clock = 900;
    expect(await client.variantFor("new-nav")).toBe("treatment");
    expect(backend.fetch).toHaveBeenCalledTimes(1);
    clock = 1_100;
    expect(await client.variantFor("new-nav")).toBe("control");
    expect(backend.fetch).toHaveBeenCalledTimes(2);
  });
});
