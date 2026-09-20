import { describe, expect, it, vi } from "vitest";
import { SearchFacade, type Hit } from "./impl";

describe("SearchFacade", () => {
  it("serves the cached hits when the search backend is unavailable", async () => {
    const cached: Hit[] = [
      { id: "doc_1", score: 9 },
      { id: "doc_2", score: 4 },
    ];
    const client = { query: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")) };
    const facade = new SearchFacade(client, new Map([["invoices", cached]]));

    await expect(facade.search("invoices")).resolves.toEqual(cached);
  });
});
