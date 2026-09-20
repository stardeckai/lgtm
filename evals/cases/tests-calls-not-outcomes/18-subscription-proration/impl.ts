export type Plan = { id: string; monthlyCents: number };

export class InvoiceDraft {
  private lines: { label: string; cents: number }[] = [];
  add(label: string, cents: number): void {
    this.lines.push({ label, cents });
  }
  totalCents(): number {
    return this.lines.reduce((sum, l) => sum + l.cents, 0);
  }
  labels(): string[] {
    return this.lines.map((l) => l.label);
  }
}

export interface PlanCatalog {
  get(id: string): Plan;
}

export function switchPlan(
  draft: InvoiceDraft,
  catalog: PlanCatalog,
  fromPlanId: string,
  toPlanId: string,
  daysLeftInCycle: number,
): void {
  const from = catalog.get(fromPlanId);
  const to = catalog.get(toPlanId);
  const ratio = daysLeftInCycle / 30;
  draft.add(`credit:${from.id}`, -Math.round(from.monthlyCents * ratio));
  draft.add(`charge:${to.id}`, Math.round(to.monthlyCents * ratio));
}
