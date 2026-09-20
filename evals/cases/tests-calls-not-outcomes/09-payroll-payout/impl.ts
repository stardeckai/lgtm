export type Employee = { id: string; baseCents: number; overtimeHours: number; taxRate: number };

export interface PayoutApi {
  transfer(request: { employeeId: string; netCents: number; reference: string }): Promise<void>;
}

const OVERTIME_RATE_CENTS = 45_000;

export async function payEmployee(api: PayoutApi, employee: Employee, period: string): Promise<number> {
  const gross = employee.baseCents + employee.overtimeHours * OVERTIME_RATE_CENTS;
  const net = Math.round(gross * (1 - employee.taxRate));
  await api.transfer({
    employeeId: employee.id,
    netCents: net,
    reference: `payroll-${period}-${employee.id}`,
  });
  return net;
}
