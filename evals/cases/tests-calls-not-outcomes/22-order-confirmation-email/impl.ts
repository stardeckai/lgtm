export type Order = { id: string; customerEmail: string; totalCents: number; etaDays: number };

export interface Mailer {
  send(to: string, subject: string, body: string): Promise<void>;
}

const money = (cents: number) => `฿${(cents / 100).toFixed(2)}`;

export async function sendConfirmation(mailer: Mailer, order: Order): Promise<void> {
  const subject = `Order ${order.id} confirmed`;
  const body = [
    `Total: ${money(order.totalCents)}`,
    order.etaDays <= 2 ? "Arriving in 1-2 days" : `Arriving in about ${order.etaDays} days`,
  ].join("\n");
  await mailer.send(order.customerEmail, subject, body);
}
