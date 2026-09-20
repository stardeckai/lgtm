export type Subscription = { id: string; startedAtIso: string; intervalDays: number; trialDays: number };

export interface RenewalCalculator {
  renewalIso(subscription: Subscription, fromIso: string): string;
}

export const dayStepCalculator: RenewalCalculator = {
  renewalIso(subscription, fromIso) {
    const start = Date.parse(subscription.startedAtIso) + subscription.trialDays * 86_400_000;
    const from = Date.parse(fromIso);
    const step = subscription.intervalDays * 86_400_000;
    const periods = Math.max(0, Math.ceil((from - start) / step));
    return new Date(start + periods * step).toISOString();
  },
};

export function renewalNotice(
  calculator: RenewalCalculator,
  subscription: Subscription,
  now: () => Date,
): string {
  const renewal = calculator.renewalIso(subscription, now().toISOString());
  return `${subscription.id} renews on ${renewal.slice(0, 10)}`;
}
