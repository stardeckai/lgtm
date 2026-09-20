export type Zone = "street" | "garage" | "airport";

export function zoneLabel(zone: Zone): string {
  return {
    street: "On street",
    garage: "Multi-storey",
    airport: "Airport long stay",
  }[zone];
}
