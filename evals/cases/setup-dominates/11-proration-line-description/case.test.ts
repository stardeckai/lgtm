import { describe, expect, it } from "vitest";
import { prorationLine, type Plan } from "./impl";

describe("prorationLine", () => {
  it("names both plans and the remaining days in the line description", () => {
    const catalogue: Plan[] = [
      { id: "plan_starter", name: "Starter", monthlyCents: 2900 },
      { id: "plan_growth", name: "Growth", monthlyCents: 9900 },
      { id: "plan_scale", name: "Scale", monthlyCents: 29900 },
      { id: "plan_enterprise", name: "Enterprise", monthlyCents: 99900 },
    ];
    const coupons = [
      { code: "LAUNCH25", percentOff: 25, durationMonths: 3, appliesToPlans: ["plan_growth", "plan_scale"] },
      { code: "WINBACK", percentOff: 40, durationMonths: 1, appliesToPlans: ["plan_starter"] },
    ];
    const taxRates = [
      { country: "GB", percent: 20, inclusive: false },
      { country: "DE", percent: 19, inclusive: false },
      { country: "US", percent: 0, inclusive: false },
    ];
    const subscription = {
      id: "sub_3312",
      customerId: "cus_881",
      planId: "plan_growth",
      status: "active",
      currentPeriodStart: "2024-03-01T00:00:00.000Z",
      currentPeriodEnd: "2024-03-31T00:00:00.000Z",
      collectionMethod: "charge_automatically",
      defaultPaymentMethod: "pm_1122",
    };
    const usageRecords = Array.from({ length: 31 }, (_, i) => ({
      subscriptionId: subscription.id,
      day: `2024-03-${String(i + 1).padStart(2, "0")}`,
      apiCalls: 1200 + i * 17,
      seats: 14,
    }));

    expect(prorationLine(catalogue[1]!, catalogue[2]!, 12, 31).description).toBe(
      "Change from Growth to Scale (12 of 31 days)",
    );
  });
});
