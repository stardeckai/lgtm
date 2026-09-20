import { describe, expect, it, vi } from "vitest";
import { recordExport, type ComplianceLog } from "./impl";

describe("recordExport", () => {
  it("appends a compliance record naming the tenant, the actor and the row count", () => {
    const log: ComplianceLog = { append: vi.fn() };

    recordExport(
      log,
      { tenantId: "t-42", requestedBy: "u-9", rows: 1_337, format: "csv" },
      new Date("2024-07-04T12:00:00.000Z"),
    );

    expect(log.append).toHaveBeenCalledWith({
      kind: "data.exported",
      tenantId: "t-42",
      actorId: "u-9",
      rowCount: 1_337,
      at: "2024-07-04T12:00:00.000Z",
    });
  });
});
