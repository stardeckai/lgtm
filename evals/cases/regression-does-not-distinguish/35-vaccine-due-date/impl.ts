export type Vaccination = {
  name: string;
  givenOn: string;
  intervalDays: number;
};

export function nextDueOn(vaccination: Vaccination): string {
  const given = new Date(`${vaccination.givenOn}T00:00:00Z`);
  if (Number.isNaN(given.getTime()))
    throw new Error(`bad date ${vaccination.givenOn}`);
  given.setUTCDate(given.getUTCDate() + vaccination.intervalDays);
  return given.toISOString().slice(0, 10);
}
