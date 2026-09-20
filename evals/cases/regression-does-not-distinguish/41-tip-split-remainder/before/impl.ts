export function splitTipCents(totalCents: number, people: number): number[] {
  if (people <= 0) throw new Error("need at least one person");
  const each = Math.floor(totalCents / people);
  return Array.from({ length: people }, () => each);
}
