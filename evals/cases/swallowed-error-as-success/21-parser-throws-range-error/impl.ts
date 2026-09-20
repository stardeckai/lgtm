export type Duration = { hours: number; minutes: number };

export function parseDuration(input: string): Duration {
  const match = /^(\d{1,3}):([0-5]\d)$/.exec(input.trim());
  if (!match) throw new RangeError(`cannot read "${input}" as hh:mm`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 168) throw new RangeError("durations over one week are not supported");
  return { hours, minutes };
}
