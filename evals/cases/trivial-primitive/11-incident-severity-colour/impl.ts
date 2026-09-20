export type Severity = "sev1" | "sev2" | "sev3" | "sev4" | "sev5";

export function severityColour(severity: Severity): string {
  switch (severity) {
    case "sev1":
      return "red";
    case "sev2":
      return "orange";
    case "sev3":
      return "amber";
    case "sev4":
      return "blue";
    case "sev5":
      return "grey";
  }
}

export function incidentBadge(incident: { id: string; severity: Severity }): {
  text: string;
  colour: string;
} {
  return { text: incident.id, colour: severityColour(incident.severity) };
}
