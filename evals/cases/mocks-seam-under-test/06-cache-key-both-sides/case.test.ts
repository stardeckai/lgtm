import { describe, expect, it, vi } from "vitest";
import { cachedReport, type Cache, type ReportQuery } from "./impl";

const query: ReportQuery = { orgId: "org1", from: "2024-01-01", to: "2024-01-31", currency: "USD" };

describe("cachedReport", () => {
  it("serves the second identical request from the cache instead of recomputing", async () => {
    const cache: Cache = {
      get: vi.fn().mockResolvedValue('{"rows":3}'),
      set: vi.fn().mockResolvedValue(undefined),
    };
    const compute = vi.fn().mockResolvedValue('{"rows":3}');

    await cachedReport(cache, query, compute);
    const second = await cachedReport(cache, query, compute);

    expect(second).toBe('{"rows":3}');
    expect(compute).not.toHaveBeenCalled();
  });
});
