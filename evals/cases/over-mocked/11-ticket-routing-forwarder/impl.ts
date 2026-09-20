import { resolveStation } from "./stations";
import { printerFor } from "./printers";
import { applyRedirects } from "./redirects";

export type Ticket = { orderId: string; lines: { sku: string; category: string }[]; branchId: string };

export async function routeTicket(ticket: Ticket): Promise<{ stationId: string; printerId: string }> {
  const station = await resolveStation(ticket.branchId, ticket.lines);
  const finalStation = await applyRedirects(station);
  const printer = await printerFor(finalStation);
  return { stationId: finalStation, printerId: printer };
}
