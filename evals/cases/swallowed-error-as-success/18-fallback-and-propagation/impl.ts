export class UpstreamUnavailable extends Error {
  constructor(readonly cause: unknown) {
    super("rates service unavailable");
    this.name = "UpstreamUnavailable";
  }
}

export type RateSource = { latest(pair: string): Promise<number> };

export async function convertCents(
  source: RateSource,
  pair: string,
  cents: number,
  lastKnownRate: number | null,
): Promise<{ cents: number; rate: number; stale: boolean }> {
  if (!Number.isInteger(cents)) throw new TypeError("cents must be an integer");
  try {
    const rate = await source.latest(pair);
    return { cents: Math.round(cents * rate), rate, stale: false };
  } catch (err) {
    if (lastKnownRate === null) throw new UpstreamUnavailable(err);
    return { cents: Math.round(cents * lastKnownRate), rate: lastKnownRate, stale: true };
  }
}
