const TRUNK_PREFIX: Record<string, string> = { "66": "0", "44": "0", "1": "1" };

export function toE164(input: string, defaultCountryCode: string): string {
  const digits = input.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  const trunk = TRUNK_PREFIX[defaultCountryCode];
  const national = trunk && digits.startsWith(trunk) ? digits.slice(trunk.length) : digits;
  if (national.length === 0) throw new Error("phone number has no digits");
  return `+${defaultCountryCode}${national}`;
}
