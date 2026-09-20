import { beforeEach, describe, expect, it } from "vitest";
import { PaymentError, TerminalPayments } from "./impl";

let payments: TerminalPayments;

beforeEach(() => {
  payments = new TerminalPayments();
});

describe("TerminalPayments", () => {
  it("cancels a pending terminal payment and rejects a second cancel", () => {
    const intent = payments.createIntent(2500);

    payments.cancelIntent(intent.id);
    expect(payments.getIntent(intent.id)?.status).toBe("CANCELED");

    expect(() => payments.cancelIntent(intent.id)).toThrow(PaymentError);
    try {
      payments.cancelIntent(intent.id);
    } catch (error) {
      expect((error as PaymentError).statusCode).toBe(409);
    }
    expect(payments.getIntent(intent.id)?.status).toBe("CANCELED");
  });
});
