export type Channel = "line" | "email" | "sms";

export interface Transport {
  deliver(to: string, text: string): Promise<void>;
}

export class MessengerRegistry {
  private static instance: MessengerRegistry | null = null;
  private transports = new Map<Channel, Transport>();

  static shared(): MessengerRegistry {
    if (!MessengerRegistry.instance) MessengerRegistry.instance = new MessengerRegistry();
    return MessengerRegistry.instance;
  }

  register(channel: Channel, transport: Transport): void {
    if (this.transports.has(channel)) throw new Error(`${channel} already registered`);
    this.transports.set(channel, transport);
  }

  async send(channel: Channel, to: string, text: string): Promise<void> {
    const transport = this.transports.get(channel);
    if (!transport) throw new Error(`no transport for ${channel}`);
    await transport.deliver(to, text);
  }
}
