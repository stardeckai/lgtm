import { describe, expect, it } from "vitest";
import { healthHandler } from "./impl";

describe("healthHandler", () => {
  it("answers 503 with a saturated queue check once the backlog passes ten thousand", async () => {
    const saturated = await healthHandler({ db: async () => true, queueDepth: async () => 10_001 });
    const healthy = await healthHandler({ db: async () => true, queueDepth: async () => 10_000 });

    expect(saturated).toEqual({
      status: 503,
      body: { ok: false, checks: { database: "up", queue: "saturated" } },
    });
    expect(healthy.status).toBe(200);
  });
});
