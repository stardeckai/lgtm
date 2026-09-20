const GSM7 = new Set(
  "@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà\n\r".split(""),
);
const EXTENDED = new Set("^{}\\[~]|€".split(""));

export function isGsm7(text: string): boolean {
  return [...text].every((char) => GSM7.has(char) || EXTENDED.has(char));
}

export function unitCount(text: string): number {
  if (!isGsm7(text)) return [...text].reduce((sum, char) => sum + (char.codePointAt(0)! > 0xffff ? 2 : 1), 0);
  return [...text].reduce((sum, char) => sum + (EXTENDED.has(char) ? 2 : 1), 0);
}

export function segments(text: string): number {
  const units = unitCount(text);
  if (units === 0) return 1;
  const single = isGsm7(text) ? 160 : 70;
  const multi = isGsm7(text) ? 153 : 67;
  return units <= single ? 1 : Math.ceil(units / multi);
}
