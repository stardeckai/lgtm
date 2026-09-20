export type Address = { line1: string; city: string; postcode: string; country: string };

const POSTCODE_BY_COUNTRY: Record<string, RegExp> = {
  SG: /^\d{6}$/,
  GB: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/,
  US: /^\d{5}(-\d{4})?$/,
};

export function validateAddress(raw: Record<string, unknown>): Address {
  const fields = ["line1", "city", "postcode", "country"] as const;
  for (const field of fields) {
    if (typeof raw[field] !== "string" || (raw[field] as string).length === 0) {
      throw new Error(`address ${field} is required`);
    }
  }
  const address = {
    line1: raw.line1 as string,
    city: raw.city as string,
    postcode: (raw.postcode as string).toUpperCase(),
    country: (raw.country as string).toUpperCase(),
  };
  const pattern = POSTCODE_BY_COUNTRY[address.country];
  if (pattern && !pattern.test(address.postcode)) {
    throw new Error(`invalid postcode for ${address.country}`);
  }
  return address;
}

export function isDomestic(address: Address, merchantCountry: string): boolean {
  return address.country === merchantCountry.toUpperCase();
}
