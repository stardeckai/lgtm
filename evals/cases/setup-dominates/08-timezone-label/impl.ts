export function offsetLabel(minutesFromUtc: number): string {
  const sign = minutesFromUtc < 0 ? "-" : "+";
  const abs = Math.abs(minutesFromUtc);
  const hours = String(Math.floor(abs / 60)).padStart(2, "0");
  const minutes = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

export function parseOffsetLabel(label: string): number {
  const match = /^UTC([+-])(\d{2}):(\d{2})$/.exec(label);
  if (!match) throw new Error(`unrecognised offset label ${label}`);
  const minutes = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === "-" ? -minutes : minutes;
}

export function shiftMinutes(utcMinuteOfDay: number, offsetMinutes: number): number {
  return ((utcMinuteOfDay + offsetMinutes) % 1440 + 1440) % 1440;
}
