export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function isPlainObject(value: Json): value is { [key: string]: Json } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function mergeConfig(
  defaults: { [key: string]: Json },
  overrides: { [key: string]: Json },
): { [key: string]: Json } {
  const out: { [key: string]: Json } = { ...defaults };
  for (const [key, value] of Object.entries(overrides)) {
    const base = out[key];
    if (base !== undefined && isPlainObject(base) && isPlainObject(value)) {
      out[key] = mergeConfig(base, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}
