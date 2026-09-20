import { describe, expect, it, vi } from "vitest";
import { QueryCache, type Backend } from "./impl";

describe("QueryCache", () => {
  it("keys cache entries by tenant so two tenants never share rows", () => {
    const backend: Backend = { run: vi.fn().mockResolvedValue([]) };
    const cache = new QueryCache(backend);

    const key = (cache as any).cacheKey({
      tenantId: "t-1",
      table: "orders",
      filters: { status: "open", limit: 10 },
    });

    expect(key).toBe("t-1|orders|limit=10&status=open");
  });
});
