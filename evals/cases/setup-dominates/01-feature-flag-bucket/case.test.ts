import { describe, expect, it } from "vitest";
import { isFlagOn, type Flag } from "./impl";

describe("isFlagOn", () => {
  it("keeps a user out of the rollout once the percentage is below their bucket", () => {
    const organization = {
      id: "org_9f2",
      name: "Northwind Trading",
      slug: "northwind",
      plan: "enterprise",
      seats: 240,
      billingEmail: "ap@northwind.example",
      createdAt: "2021-04-02T09:00:00.000Z",
      address: { line1: "8 Harbour Road", city: "Bristol", country: "GB", postcode: "BS1 5TY" },
      contacts: [
        { role: "owner", email: "ada@northwind.example", name: "Ada Fields" },
        { role: "security", email: "sec@northwind.example", name: "Ruth Vale" },
      ],
    };
    const subscription = {
      orgId: organization.id,
      priceId: "price_ent_annual",
      status: "active",
      currentPeriodEnd: "2025-04-02T09:00:00.000Z",
      addOns: ["sso", "audit-log", "data-residency"],
      discountPercent: 12,
    };
    const members = Array.from({ length: 24 }, (_, i) => ({
      id: `usr_${100 + i}`,
      orgId: organization.id,
      email: `member${i}@northwind.example`,
      role: i === 0 ? "owner" : "member",
      lastSeenAt: `2024-05-${String((i % 27) + 1).padStart(2, "0")}T12:00:00.000Z`,
    }));
    const otherFlags: Flag[] = [
      { key: "new-nav", rolloutPercent: 100, enabled: true },
      { key: "bulk-export", rolloutPercent: 50, enabled: true },
      { key: "inline-editing", rolloutPercent: 5, enabled: false },
      { key: "dark-mode", rolloutPercent: 100, enabled: true },
    ];
    const registry = new Map(otherFlags.map((f) => [f.key, f]));
    registry.set("beta-search", { key: "beta-search", rolloutPercent: 0, enabled: true });
    const auditTrail: string[] = [];
    for (const member of members) auditTrail.push(`${member.id}:${subscription.status}`);

    expect(isFlagOn(registry.get("beta-search")!, members[3]!.id)).toBe(false);
  });
});
