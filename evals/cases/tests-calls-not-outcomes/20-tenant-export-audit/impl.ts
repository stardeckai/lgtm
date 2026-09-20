export type ExportRequest = { tenantId: string; requestedBy: string; rows: number; format: "csv" | "json" };

export interface ComplianceLog {
  append(record: {
    kind: "data.exported";
    tenantId: string;
    actorId: string;
    rowCount: number;
    at: string;
  }): void;
}

export function recordExport(log: ComplianceLog, request: ExportRequest, at: Date): void {
  log.append({
    kind: "data.exported",
    tenantId: request.tenantId,
    actorId: request.requestedBy,
    rowCount: request.rows,
    at: at.toISOString(),
  });
}
