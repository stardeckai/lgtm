export const REGION_NAMES: Record<string, string> = {
  US: "United States",
  DE: "Germany",
  JP: "Japan",
  OTHER: "Other",
};

/**
 * Intl.DisplayNames is not present in every runtime the admin bundle ships to,
 * so the static table is the fallback rather than the primary source.
 */
export function getRegionLabel(code: string, locale: string): string {
  if (code === "OTHER") return REGION_NAMES.OTHER!;
  try {
    const display = new Intl.DisplayNames([locale], { type: "region" });
    const label = display.of(code);
    if (label && label !== code) return label;
  } catch {
    // fall through to the static table
  }
  return REGION_NAMES[code] ?? code;
}
