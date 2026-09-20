export type Carrier = { code: string; name: string; trackingTemplate: string };

export function trackingUrl(carriers: Carrier[], carrierCode: string, trackingNumber: string): string | null {
  const carrier = carriers.find((c) => c.code === carrierCode);
  if (!carrier) return null;
  return carrier.trackingTemplate.replace("{number}", encodeURIComponent(trackingNumber));
}

export function carrierName(carriers: Carrier[], carrierCode: string): string {
  return carriers.find((c) => c.code === carrierCode)?.name ?? "Unknown carrier";
}

export function supportsTracking(carriers: Carrier[], carrierCode: string): boolean {
  const carrier = carriers.find((c) => c.code === carrierCode);
  return carrier !== undefined && carrier.trackingTemplate.includes("{number}");
}
