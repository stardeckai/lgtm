import { describe, expect, it } from "vitest";
import { renewalNotice, type RenewalCalculator, type Subscription } from "./impl";

const calculator: RenewalCalculator = {
  renewalIso(subscription, fromIso) {
    const start = Date.parse(subscription.startedAtIso) + subscription.trialDays * 86_400_000;
    const step = subscription.intervalDays * 86_400_000;
    const periods = Math.max(0, Math.ceil((Date.parse(fromIso) - start) / step));
    return new Date(start + periods * step).toISOString();
  },
};

const subscription: Subscription = {
  id: "sub_204",
  startedAtIso: "2024-01-05T00:00:00.000Z",
  intervalDays: 30,
  trialDays: 14,
};

describe("renewalNotice", () => {
  it("counts the renewal from the end of the trial, not from signup", () => {
    const notice = renewalNotice(calculator, subscription, () => new Date("2024-04-02T12:00:00.000Z"));

    expect(notice).toBe("sub_204 renews on 2024-04-18");
  });
});
