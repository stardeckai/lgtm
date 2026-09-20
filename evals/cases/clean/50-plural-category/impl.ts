export type PluralCategory = "one" | "few" | "many" | "other";

export function pluralCategory(locale: string, count: number): PluralCategory {
  const n = Math.abs(count);
  if (!Number.isInteger(n)) return "other";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (locale.startsWith("ru")) {
    if (mod10 === 1 && mod100 !== 11) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "many";
  }
  if (locale.startsWith("pl")) {
    if (n === 1) return "one";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "few";
    return "many";
  }
  return n === 1 ? "one" : "other";
}

export function pluralize(locale: string, count: number, forms: Partial<Record<PluralCategory, string>>): string {
  const category = pluralCategory(locale, count);
  const template = forms[category] ?? forms.other ?? "";
  return template.replace("{n}", String(count));
}
