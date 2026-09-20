import { describe, expect, it, vi } from "vitest";
import { InvoiceDraft, switchPlan, type Plan, type PlanCatalog } from "./impl";

describe("switchPlan", () => {
  it("credits the unused old plan and charges the new one for the rest of the cycle", () => {
    const plans: Record<string, Plan> = {
      starter: { id: "starter", monthlyCents: 3_000 },
      growth: { id: "growth", monthlyCents: 9_000 },
    };
    const catalog: PlanCatalog = { get: vi.fn((id: string) => plans[id]!) };
    const draft = new InvoiceDraft();

    switchPlan(draft, catalog, "starter", "growth", 15);

    expect(draft.labels()).toEqual(["credit:starter", "charge:growth"]);
    expect(draft.totalCents()).toBe(3_000);
    expect(catalog.get).toHaveBeenCalledTimes(2);
  });
});
