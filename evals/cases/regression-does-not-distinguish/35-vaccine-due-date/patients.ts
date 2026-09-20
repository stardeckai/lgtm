export type Patient = { id: string; name: string; speciesCode: string };

export function displayName(patient: Patient): string {
  return `${patient.name} (${patient.speciesCode})`;
}
