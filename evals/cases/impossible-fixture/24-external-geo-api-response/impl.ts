export type GeoLookupResponse = {
  status: string;
  results: { country_code: string; timezone: string }[];
};

export async function fetchGeo(ip: string, doFetch: typeof fetch): Promise<GeoLookupResponse> {
  const response = await doFetch(`https://geo.example.com/v1/${ip}`);
  if (!response.ok) throw new Error(`geo lookup failed with ${response.status}`);
  return (await response.json()) as GeoLookupResponse;
}

export async function resolveTimezone(ip: string, doFetch: typeof fetch): Promise<string> {
  const payload = await fetchGeo(ip, doFetch);
  if (payload.status !== "ok") return "UTC";
  return payload.results[0]?.timezone ?? "UTC";
}
