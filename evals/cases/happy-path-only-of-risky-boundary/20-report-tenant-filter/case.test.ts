import { describe, expect, it } from "vitest";
import { regionTotals, type SalesRow } from "./impl";

const rows: SalesRow[] = [
  { orgId: "org_a", region: "apac", cents: 1_000 },
  { orgId: "org_a", region: "emea", cents: 2_500 },
  { orgId: "org_b", region: "apac", cents: 9_999 },
];

describe("regionTotals", () => {
  it("sums only the rows of the requesting organisation", () => {
    expect(regionTotals(rows, "org_a")).toEqual({ apac: 1_000, emea: 2_500 });
    expect(regionTotals(rows, "org_b")).toEqual({ apac: 9_999 });
  });

  it("returns an empty report for an organisation with no sales", () => {
    expect(regionTotals(rows, "org_c")).toEqual({});
  });
});
