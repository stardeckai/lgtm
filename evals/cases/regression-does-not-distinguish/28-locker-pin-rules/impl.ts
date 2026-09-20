export function lockerLabel(row: number, column: number): string {
  return `${String.fromCharCode(64 + row)}${column}`;
}

const WEAK_PINS = new Set(["0000", "1234", "1111", "9999"]);

export function isPinAcceptable(pin: string): boolean {
  if (!/^\d{4}$/.test(pin)) return false;
  if (WEAK_PINS.has(pin)) return false;
  return new Set(pin).size > 1;
}
