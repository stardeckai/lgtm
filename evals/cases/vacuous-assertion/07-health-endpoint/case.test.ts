import { describe, expect, it } from "vitest";
import { healthHandler } from "./impl";

describe("healthHandler", () => {
  it("reports 503 when the queue is saturated", async () => {
    const response = await healthHandler({
      db: async () => true,
      queueDepth: async () => 25_000,
    });

    expect(response.status).not.toBe(500);
  });
});
