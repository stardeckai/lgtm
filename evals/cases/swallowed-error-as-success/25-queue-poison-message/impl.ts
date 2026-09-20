export type Message = { id: string; body: string; attempts: number };

export class Consumer {
  readonly deadLetters: Message[] = [];
  readonly processed: string[] = [];

  constructor(private readonly maxAttempts: number) {}

  handle(message: Message, work: (body: string) => void): void {
    try {
      work(message.body);
      this.processed.push(message.id);
    } catch (err) {
      const attempts = message.attempts + 1;
      if (attempts >= this.maxAttempts) {
        this.deadLetters.push({ ...message, attempts });
        return;
      }
      throw err;
    }
  }
}
