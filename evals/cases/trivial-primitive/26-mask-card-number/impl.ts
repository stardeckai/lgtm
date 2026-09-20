export function maskPan(pan: string): string {
  const digits = pan.replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) throw new Error("not a card number");
  const last4 = digits.slice(-4);
  const bin = digits.slice(0, 6);
  return `${bin}${"*".repeat(digits.length - 10)}${last4}`;
}
