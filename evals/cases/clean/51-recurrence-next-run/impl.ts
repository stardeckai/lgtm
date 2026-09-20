export type Recurrence = { localHour: number; localMinute: number; weekdays: number[] };

export type OffsetRule = { fromUtcMs: number; offsetMinutes: number };

export function offsetAt(rules: OffsetRule[], utcMs: number): number {
  let current = rules[0]!.offsetMinutes;
  for (const rule of rules) {
    if (utcMs >= rule.fromUtcMs) current = rule.offsetMinutes;
  }
  return current;
}

export function nextRunUtc(recurrence: Recurrence, rules: OffsetRule[], afterUtcMs: number): number {
  for (let step = 0; step <= 8; step++) {
    const offset = offsetAt(rules, afterUtcMs + step * 86_400_000);
    const local = new Date(afterUtcMs + step * 86_400_000 + offset * 60_000);
    if (!recurrence.weekdays.includes(local.getUTCDay())) continue;
    const candidateLocal = Date.UTC(
      local.getUTCFullYear(),
      local.getUTCMonth(),
      local.getUTCDate(),
      recurrence.localHour,
      recurrence.localMinute,
    );
    const candidateUtc = candidateLocal - offsetAt(rules, candidateLocal - offset * 60_000) * 60_000;
    if (candidateUtc > afterUtcMs) return candidateUtc;
  }
  throw new Error("no occurrence within eight days");
}
