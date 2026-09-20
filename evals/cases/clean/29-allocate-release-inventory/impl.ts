export type Location = { code: string; available: number };

export class Inventory {
  constructor(private readonly locations: Location[]) {}

  snapshot(): Record<string, number> {
    return Object.fromEntries(this.locations.map((l) => [l.code, l.available]));
  }

  take(code: string, units: number): void {
    const location = this.locations.find((l) => l.code === code);
    if (!location || location.available < units) throw new Error(`cannot take ${units} from ${code}`);
    location.available -= units;
  }

  give(code: string, units: number): void {
    const location = this.locations.find((l) => l.code === code);
    if (!location) throw new Error(`unknown location ${code}`);
    location.available += units;
  }
}

export type Allocation = { code: string; units: number };

export function allocate(inventory: Inventory, units: number): Allocation[] {
  const plan: Allocation[] = [];
  let remaining = units;
  for (const [code, available] of Object.entries(inventory.snapshot()).sort((a, b) => b[1] - a[1])) {
    if (remaining === 0) break;
    const take = Math.min(available, remaining);
    if (take === 0) continue;
    inventory.take(code, take);
    plan.push({ code, units: take });
    remaining -= take;
  }
  if (remaining > 0) {
    release(inventory, plan);
    throw new Error(`short by ${remaining} units`);
  }
  return plan;
}

export function release(inventory: Inventory, plan: Allocation[]): void {
  for (const line of plan) inventory.give(line.code, line.units);
}
