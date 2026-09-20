import { describe, expect, it, vi } from "vitest";
import { routeTicket } from "./impl";

vi.mock("./stations", () => ({ resolveStation: vi.fn().mockResolvedValue("grill") }));
vi.mock("./redirects", () => ({ applyRedirects: vi.fn().mockResolvedValue("grill-backup") }));
vi.mock("./printers", () => ({ printerFor: vi.fn().mockResolvedValue("prn-2") }));

describe("routeTicket", () => {
  it("sends a grill ticket to the backup station's printer when grill is disabled", async () => {
    const result = await routeTicket({
      orderId: "o-1",
      lines: [{ sku: "burger", category: "grill" }],
      branchId: "b-1",
    });

    expect(result).toEqual({ stationId: "grill-backup", printerId: "prn-2" });
  });
});
