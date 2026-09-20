const WEIGHTS = [8, 6, 4, 2, 3, 5, 9, 7];

export function accountCheckDigit(base: string): number {
  const digits = [...base].map((c) => Number(c));
  const sum = digits.reduce((acc, digit, index) => acc + digit * (WEIGHTS[index] ?? 1), 0);
  const remainder = sum % 11;
  return remainder === 0 ? 0 : 11 - remainder;
}

export function isValidAccount(full: string): boolean {
  if (!/^\d{9}$/.test(full)) return false;
  return accountCheckDigit(full.slice(0, 8)) === Number(full.slice(8));
}
