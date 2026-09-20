export interface GeoLookup {
  locate(ip: string): Promise<{ countryCode: string; regionCode: string | null } | null>;
}

const ZONES: Record<string, number> = { US: 1, CA: 1, GB: 2, DE: 2, FR: 2, JP: 3, AU: 3 };

export type ShippingOption = { zone: number; freeOverCents: number; estimateDays: number };

export async function shippingOptionFor(lookup: GeoLookup, ip: string): Promise<ShippingOption> {
  const location = await lookup.locate(ip);
  const zone = location ? (ZONES[location.countryCode] ?? 4) : 4;
  return {
    zone,
    freeOverCents: zone === 1 ? 5000 : zone === 2 ? 9000 : 15000,
    estimateDays: 2 + (zone - 1) * 3,
  };
}
