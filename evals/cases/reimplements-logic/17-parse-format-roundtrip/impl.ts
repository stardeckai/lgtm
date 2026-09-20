export type Duration = { hours: number; minutes: number; seconds: number };

export function formatDuration(duration: Duration): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(duration.hours)}:${pad(duration.minutes)}:${pad(duration.seconds)}`;
}

export function parseDuration(text: string): Duration {
  const match = /^(\d{2}):([0-5]\d):([0-5]\d)$/.exec(text);
  if (!match) throw new Error(`malformed duration ${text}`);
  return {
    hours: Number(match[1]),
    minutes: Number(match[2]),
    seconds: Number(match[3]),
  };
}
