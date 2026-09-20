export function redactUrl(raw: string): string {
  const url = new URL(raw);
  if (url.password) url.password = "***";
  const sensitive = ["token", "api_key", "sslcert"];
  for (const key of sensitive) {
    if (url.searchParams.has(key)) url.searchParams.set(key, "***");
  }
  return url.toString();
}
