export type Quota = { orgId: string; used: number; limit: number };

export class QuotaBook {
  constructor(private readonly quotas: Map<string, Quota>) {}

  consume(orgId: string, units: number): { granted: boolean; used: number } {
    const quota = this.quotas.get(orgId);
    if (!quota) throw new Error(`no quota for ${orgId}`);
    if (quota.used + units > quota.limit) return { granted: false, used: quota.used };
    quota.used += units;
    return { granted: true, used: quota.used };
  }
}
