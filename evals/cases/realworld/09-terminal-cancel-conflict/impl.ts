export class PaymentError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "PaymentError";
  }
}

export type Intent = { id: string; amount: number; status: "PENDING" | "CANCELED" | "SETTLED" };

export class TerminalPayments {
  private readonly intents = new Map<string, Intent>();
  private sequence = 0;

  createIntent(amount: number): Intent {
    const intent: Intent = { id: `pi_${++this.sequence}`, amount, status: "PENDING" };
    this.intents.set(intent.id, intent);
    return intent;
  }

  getIntent(id: string): Intent | undefined {
    return this.intents.get(id);
  }

  cancelIntent(id: string): Intent {
    const intent = this.intents.get(id);
    if (!intent) throw new PaymentError("intent not found", 404);
    if (intent.status !== "PENDING") throw new PaymentError("intent is no longer cancelable", 409);
    intent.status = "CANCELED";
    return intent;
  }
}
