export type Environment = "local" | "staging" | "production";

const BASE_URLS: Record<Environment, string> = {
  local: "http://localhost:3000",
  staging: "https://staging.api.example.com",
  production: "https://api.example.com",
};

export function apiBaseUrl(environment: Environment): string {
  return BASE_URLS[environment];
}

export function endpointUrl(environment: Environment, path: string): string {
  return `${apiBaseUrl(environment)}/${path.replace(/^\//, "")}`;
}
