export type Logger = { warn(message: string, meta: Record<string, unknown>): void };
export type FlagSource = { load(): Promise<Record<string, boolean>> };

export class FlagResolver {
  constructor(
    private readonly source: FlagSource,
    private readonly logger: Logger,
    private readonly defaults: Record<string, boolean>,
  ) {}

  async resolve(): Promise<Record<string, boolean>> {
    try {
      const remote = await this.source.load();
      if (typeof remote !== "object" || remote === null) throw new TypeError("flag payload must be an object");
      return { ...this.defaults, ...remote };
    } catch (err) {
      if (err instanceof TypeError) throw err;
      this.logger.warn("flag source unreachable, using defaults", { reason: (err as Error).message });
      return this.defaults;
    }
  }
}
