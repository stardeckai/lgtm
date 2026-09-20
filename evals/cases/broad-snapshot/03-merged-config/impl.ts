export type Config = Record<string, unknown>;

const DEFAULTS: Config = {
  host: "0.0.0.0",
  port: 3000,
  logLevel: "info",
  requestTimeoutMs: 30_000,
  maxBodyBytes: 1_048_576,
  cors: { origins: ["*"], credentials: false, maxAgeSeconds: 600 },
  database: { poolMin: 2, poolMax: 10, statementTimeoutMs: 15_000, ssl: true },
  cache: { driver: "memory", ttlSeconds: 60, maxEntries: 5000 },
  features: { signups: true, invites: true, passwordless: false },
};

export function mergeConfig(overrides: Config): Config {
  const out: Config = { ...DEFAULTS };
  for (const [key, value] of Object.entries(overrides)) {
    const base = DEFAULTS[key];
    out[key] =
      base && typeof base === "object" && !Array.isArray(base) && value && typeof value === "object"
        ? { ...(base as Config), ...(value as Config) }
        : value;
  }
  return out;
}
