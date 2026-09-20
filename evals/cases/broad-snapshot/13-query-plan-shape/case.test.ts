import { describe, expect, it } from "vitest";
import { planQuery, type Filter } from "./impl";

describe("planQuery", () => {
  it("chooses the indexed filter as the driving step", () => {
    const filters: Filter[] = [
      { field: "authorId", op: "eq", value: "usr_1" },
      { field: "tenantId", op: "eq", value: "ten_4" },
      { field: "wordCount", op: "gt", value: 500 },
    ];

    expect(planQuery("documents", filters, 25)).toMatchInlineSnapshot(`
      {
        "estimatedCost": 325,
        "index": "documents_tenantId_idx",
        "source": "documents",
        "steps": [
          {
            "detail": "documents_tenantId_idx on tenantId eq",
            "estimatedRows": 200,
            "kind": "index_scan",
          },
          {
            "detail": "authorId eq "usr_1"",
            "estimatedRows": 50,
            "kind": "filter",
          },
          {
            "detail": "wordCount gt 500",
            "estimatedRows": 50,
            "kind": "filter",
          },
          {
            "detail": "25",
            "estimatedRows": 25,
            "kind": "limit",
          },
        ],
      }
    `);
  });
});
