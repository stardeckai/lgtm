export type AnalyticsTransport = {
  send(event: string, properties: Record<string, unknown>): void;
};

export class Analytics {
  constructor(private readonly transport: AnalyticsTransport) {}

  track(event: string, properties: Record<string, unknown> = {}): void {
    this.transport.send(event, properties);
  }

  trackPurchase(orderId: string, cents: number, currency: string): void {
    this.track("purchase_completed", { orderId, value: cents / 100, currency });
  }
}
