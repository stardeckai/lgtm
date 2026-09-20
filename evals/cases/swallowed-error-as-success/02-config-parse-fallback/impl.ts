export type AppConfig = { retries: number; timeoutMs: number; region: string };

export const DEFAULT_CONFIG: AppConfig = { retries: 3, timeoutMs: 5000, region: "eu-west-1" };

export function parseConfig(raw: string): AppConfig {
  try {
    const parsed = JSON.parse(raw) as Partial<AppConfig>;
    return {
      retries: Number(parsed.retries ?? DEFAULT_CONFIG.retries),
      timeoutMs: Number(parsed.timeoutMs ?? DEFAULT_CONFIG.timeoutMs),
      region: String(parsed.region ?? DEFAULT_CONFIG.region),
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}
