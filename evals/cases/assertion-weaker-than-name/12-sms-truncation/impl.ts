const LIMIT = 160;
const ELLIPSIS = "…";

export function truncateForSms(message: string): string {
  const collapsed = message.replace(/\s+/g, " ").trim();
  if (collapsed.length <= LIMIT) return collapsed;
  const window = collapsed.slice(0, LIMIT - ELLIPSIS.length);
  const lastSpace = window.lastIndexOf(" ");
  const cut = lastSpace > LIMIT / 2 ? window.slice(0, lastSpace) : window;
  return `${cut}${ELLIPSIS}`;
}
