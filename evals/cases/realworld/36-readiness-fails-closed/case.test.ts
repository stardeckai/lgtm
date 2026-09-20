import { describe, expect, it, vi } from "vitest";
import { CatalogClientError, readinessResponse } from "./impl";

describe("catalog readiness route", () => {
  it("fails closed when the readiness probe itself fails", async () => {
    const client = {
      getReadiness: vi
        .fn()
        .mockRejectedValue(new CatalogClientError("upstream is unavailable", "unavailable", 503)),
    };

    const response = await readinessResponse(client);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ready: false,
      upstreamDataReady: false,
      consumerHealthy: false,
      catalogStatus: "unavailable",
    });
  });
});
