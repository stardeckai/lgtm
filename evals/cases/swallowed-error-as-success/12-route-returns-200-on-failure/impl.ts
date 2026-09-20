export type Request = { tenantId: string; from: string; to: string };
export type Response = { status: number; body: { rows: unknown[]; warning?: string } };
export type Reporting = { rows(tenantId: string, from: string, to: string): Promise<unknown[]> };

export async function handleReport(reporting: Reporting, request: Request): Promise<Response> {
  try {
    if (Date.parse(request.from) > Date.parse(request.to)) {
      return { status: 200, body: { rows: [], warning: "empty range" } };
    }
    const rows = await reporting.rows(request.tenantId, request.from, request.to);
    return { status: 200, body: { rows } };
  } catch {
    return { status: 200, body: { rows: [], warning: "report unavailable" } };
  }
}
