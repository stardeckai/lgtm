export function splitTipCents(totalCents: number, people: number): number[] {
  if (people <= 0) throw new Error("need at least one person");
  const each = Math.floor(totalCents / people);
  let remainder = totalCents - each * people;
  return Array.from({ length: people }, () => {
    if (remainder > 0) {
      remainder -= 1;
      return each + 1;
    }
    return each;
  });
}
