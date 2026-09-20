export type Payment = { id: string; capturedCents: number; refundedCents: number };

export class RefundService {
  private payments = new Map<string, Payment>();
  private handled = new Set<string>();

  addPayment(payment: Payment): void {
    this.payments.set(payment.id, { ...payment });
  }

  refund(paymentId: string, requestId: string, amountCents: number): Payment {
    const payment = this.payments.get(paymentId);
    if (!payment) throw new Error(`unknown payment ${paymentId}`);
    if (this.handled.has(requestId)) return { ...payment };
    if (payment.refundedCents + amountCents > payment.capturedCents) {
      throw new Error("refund exceeds captured amount");
    }
    this.handled.add(requestId);
    payment.refundedCents += amountCents;
    return { ...payment };
  }
}
