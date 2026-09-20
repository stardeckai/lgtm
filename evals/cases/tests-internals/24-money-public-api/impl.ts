export class Money {
  private constructor(
    readonly cents: number,
    readonly currency: "THB" | "USD",
  ) {}

  static of(amount: number, currency: "THB" | "USD"): Money {
    if (!Number.isFinite(amount)) throw new Error("amount must be finite");
    return new Money(Math.round(amount * 100), currency);
  }

  plus(other: Money): Money {
    if (other.currency !== this.currency) throw new Error("currency mismatch");
    return new Money(this.cents + other.cents, this.currency);
  }

  splitEvenly(ways: number): Money[] {
    if (ways < 1) throw new Error("ways must be positive");
    const base = Math.floor(this.cents / ways);
    const remainder = this.cents - base * ways;
    return Array.from({ length: ways }, (_, i) => new Money(base + (i < remainder ? 1 : 0), this.currency));
  }

  toString(): string {
    return `${this.currency} ${(this.cents / 100).toFixed(2)}`;
  }
}
