export type Shipment = {
  id: string;
  status: "pending" | "in_transit" | "delivered";
  shippedAt: string | null;
  deliveredAt: string | null;
};

export function createShipment(input: {
  id: string;
  status: Shipment["status"];
  shippedAt: string | null;
  deliveredAt: string | null;
}): Shipment {
  if (input.status !== "pending" && !input.shippedAt) {
    throw new Error("a shipment that left the warehouse must have shippedAt");
  }
  if (input.status === "delivered" && !input.deliveredAt) {
    throw new Error("a delivered shipment must have deliveredAt");
  }
  return { ...input };
}

export function transitDays(shipment: Shipment): number {
  if (!shipment.shippedAt || !shipment.deliveredAt) return 0;
  const ms = Date.parse(shipment.deliveredAt) - Date.parse(shipment.shippedAt);
  return Math.round(ms / 86_400_000);
}

export function deliverySummary(shipment: Shipment): string {
  if (shipment.status !== "delivered") return `${shipment.id} is ${shipment.status}`;
  return `${shipment.id} arrived in ${transitDays(shipment)} days`;
}
