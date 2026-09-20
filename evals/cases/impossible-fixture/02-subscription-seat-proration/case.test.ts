import { describe, expect, it } from "vitest";
import { prorationCents, type Subscription } from "./impl";

describe("prorationCents", () => {
  it("bills nothing for a business subscription with no seats", () => {
    const subscription = { id: "sub_1", plan: "business", seats: 0 } as Subscription;

    expect(prorationCents(subscription, 15)).toBe(0);
  });
});
