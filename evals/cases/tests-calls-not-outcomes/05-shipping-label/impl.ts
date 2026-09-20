export type Parcel = { weightGrams: number; destinationCountry: string; insuredCents: number };

export interface Carrier {
  createLabel(request: {
    service: "standard" | "express";
    weightGrams: number;
    country: string;
    insurance: number;
  }): Promise<{ trackingNumber: string }>;
}

export async function buyLabel(carrier: Carrier, parcel: Parcel): Promise<string> {
  const service = parcel.destinationCountry === "TH" && parcel.weightGrams <= 2000 ? "standard" : "express";
  const insurance = parcel.insuredCents > 100_000 ? 100_000 : parcel.insuredCents;
  const label = await carrier.createLabel({
    service,
    weightGrams: parcel.weightGrams,
    country: parcel.destinationCountry,
    insurance,
  });
  return label.trackingNumber;
}
