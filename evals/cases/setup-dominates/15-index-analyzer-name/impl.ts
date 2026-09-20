const ANALYZERS: Record<string, string> = {
  en: "english_stem",
  de: "german_light_stem",
  fr: "french_light_stem",
  ja: "kuromoji",
};

export function analyzerFor(language: string, hasCjk: boolean): string {
  if (hasCjk) return ANALYZERS.ja!;
  return ANALYZERS[language] ?? "standard";
}
