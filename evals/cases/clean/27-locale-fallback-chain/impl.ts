export type Catalog = Record<string, Record<string, string>>;

export function fallbackChain(locale: string): string[] {
  const parts = locale.replace("_", "-").split("-");
  const chain: string[] = [];
  for (let i = parts.length; i > 0; i--) chain.push(parts.slice(0, i).join("-"));
  if (!chain.includes("en")) chain.push("en");
  return chain;
}

export function translate(catalog: Catalog, locale: string, key: string): { text: string; from: string } | null {
  for (const candidate of fallbackChain(locale)) {
    const text = catalog[candidate]?.[key];
    if (text !== undefined) return { text, from: candidate };
  }
  return null;
}
