import { describe, expect, it, vi } from "vitest";
import { searchDocuments, type DocumentGateway } from "./impl";

describe("searchDocuments", () => {
  it("never returns a document belonging to another tenant", async () => {
    const gateway: DocumentGateway = {
      selectDocuments: vi.fn().mockResolvedValue([
        { id: "d-1", tenantId: "t-1", title: "Q1 plan", deletedAt: null },
        { id: "d-2", tenantId: "t-1", title: "Q1 budget", deletedAt: null },
      ]),
    };

    const titles = await searchDocuments(gateway, "t-1", "q1");

    expect(titles).toEqual(["Q1 plan", "Q1 budget"]);
    expect(titles.every((title) => title.startsWith("Q1"))).toBe(true);
  });
});
