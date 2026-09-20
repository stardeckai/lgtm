export type Person = { email: string; team: string; onCall: boolean; muted: boolean };

export type Incident = { severity: 1 | 2 | 3; team: string };

export function recipientsFor(incident: Incident, directory: Person[]): string[] {
  return directory
    .filter((person) => !person.muted)
    .filter((person) => {
      if (incident.severity === 1) return person.onCall || person.team === incident.team;
      if (incident.severity === 2) return person.team === incident.team && person.onCall;
      return person.team === incident.team;
    })
    .map((person) => person.email);
}
