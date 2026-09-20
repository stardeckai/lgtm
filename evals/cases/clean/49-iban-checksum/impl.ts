const LENGTHS: Record<string, number> = { DE: 22, GB: 22, NL: 18, FR: 27 };

function mod97(digits: string): number {
  let remainder = 0;
  for (const char of digits) remainder = (remainder * 10 + Number(char)) % 97;
  return remainder;
}

function toDigits(iban: string): string {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  return [...rearranged]
    .map((char) => (/[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char))
    .join("");
}

export function isValidIban(raw: string): boolean {
  const iban = raw.replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;
  const expected = LENGTHS[iban.slice(0, 2)];
  if (expected === undefined || iban.length !== expected) return false;
  return mod97(toDigits(iban)) === 1;
}

export function checkDigits(countryCode: string, bban: string): string {
  const remainder = mod97(toDigits(`${countryCode}00${bban}`));
  return String(98 - remainder).padStart(2, "0");
}
