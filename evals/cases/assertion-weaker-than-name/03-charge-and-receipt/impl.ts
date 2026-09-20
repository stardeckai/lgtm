export type Charge = { id: string; status: "captured" | "declined"; amountCents: number };

export type Email = { to: string; subject: string; body: string };

export class Checkout {
  readonly outbox: Email[] = [];

  constructor(private readonly gateway: (amountCents: number) => boolean) {}

  pay(email: string, amountCents: number): Charge {
    const ok = this.gateway(amountCents);
    const charge: Charge = {
      id: `ch_${amountCents}`,
      status: ok ? "captured" : "declined",
      amountCents,
    };
    if (ok) {
      this.outbox.push({
        to: email,
        subject: `Receipt for ${(amountCents / 100).toFixed(2)}`,
        body: `Charge ${charge.id} captured.`,
      });
    }
    return charge;
  }
}
