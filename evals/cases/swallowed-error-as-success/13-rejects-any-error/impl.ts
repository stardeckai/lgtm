export type Lease = { key: string; holder: string; expiresAtMs: number };

export class LeaseStore {
  private leases = new Map<string, Lease>();

  async acquire(key: string, holder: string, nowMs: number, ttlMs: number): Promise<Lease> {
    const current = this.leases.get(key);
    if (current && current.expiresAtMs > nowMs && current.holder !== holder) {
      throw new Error(`lease held by ${current.holder}`);
    }
    const lease = { key, holder, expiresAtMs: nowMs + ttlMs };
    this.leases.set(key, lease);
    return lease;
  }

  async release(key: string, holder: string): Promise<void> {
    const current = this.leases.get(key);
    if (!current) throw new Error("no such lease");
    if (current.holder !== holder) throw new Error("not the holder");
    this.leases.delete(key);
  }
}
