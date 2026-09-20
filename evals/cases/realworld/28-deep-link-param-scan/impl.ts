export const DESK_DEEP_LINK_PARAMS = ["ticket", "member", "visit"] as const;

export type DeepLinkParam = (typeof DESK_DEEP_LINK_PARAMS)[number];

export function buildCheckinLink(param: DeepLinkParam, value: string): string {
  return `/desk/checkin?${param}=${encodeURIComponent(value)}`;
}

export function readPreselect(search: URLSearchParams): { param: DeepLinkParam; value: string } | null {
  for (const param of DESK_DEEP_LINK_PARAMS) {
    const value = search.get(param);
    if (value) return { param, value };
  }
  return null;
}

/** Reset must drop every supported param, not only the first one. */
export function clearPreselect(search: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(search);
  for (const param of DESK_DEEP_LINK_PARAMS) next.delete(param);
  return next;
}
