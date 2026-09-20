export function localDayBoundsUtc(isoDay: string, timeZone: string): { startMs: number; endMs: number } {
  const offsetMinutesAt = (utcMs: number): number => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(utcMs)).map((part) => [part.type, part.value]),
    );
    const asUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour) % 24,
      Number(parts.minute),
      Number(parts.second),
    );
    return (asUtc - utcMs) / 60_000;
  };

  const naive = Date.parse(`${isoDay}T00:00:00Z`);
  const startMs = naive - offsetMinutesAt(naive - offsetMinutesAt(naive) * 60_000) * 60_000;
  const nextNaive = naive + 86_400_000;
  const endMs = nextNaive - offsetMinutesAt(nextNaive - offsetMinutesAt(nextNaive) * 60_000) * 60_000;
  return { startMs, endMs };
}
