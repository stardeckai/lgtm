export type Principal = { userId: string; orgId: string; role: "owner" | "member" | "support" };
export type Record_ = { id: string; orgId: string; ownerId: string; body: string };

export function mayRead(principal: Principal, record: Record_): boolean {
  if (principal.role === "support") return true;
  if (principal.orgId !== record.orgId) return false;
  return principal.role === "owner" || record.ownerId === principal.userId;
}

export class RecordStore {
  constructor(private readonly records: Record_[]) {}

  byId(id: string): Record_ | undefined {
    return this.records.find((r) => r.id === id);
  }
}

export function readRecord(store: RecordStore, principal: Principal, id: string): { status: number; body?: string } {
  const record = store.byId(id);
  if (!record) return { status: 404 };
  if (!mayRead(principal, record)) return { status: record.orgId === principal.orgId ? 403 : 404 };
  return { status: 200, body: record.body };
}
