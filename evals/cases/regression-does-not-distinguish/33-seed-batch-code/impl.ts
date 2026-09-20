import type { Species } from "./species";

export function batchCode(
  species: Species,
  harvestedOn: string,
  sequence: number,
): string {
  const [year, month] = harvestedOn.split("-");
  if (!year || !month)
    throw new Error(`unparseable harvest date ${harvestedOn}`);
  return `${species.slice(0, 3).toUpperCase()}-${year.slice(2)}${month}-${String(sequence).padStart(3, "0")}`;
}
