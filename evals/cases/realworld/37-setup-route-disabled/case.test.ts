import { describe, expect, it } from "vitest";
import { bootstrapHandler } from "./impl";

describe("production operator bootstrap", () => {
  it("is disabled even when the query secret matches the configured one", async () => {
    const request = new Request("https://app.example.com/api/setup?secret=known-secret", {
      method: "POST",
    });

    const response = await bootstrapHandler(request, {
      nodeEnv: "production",
      setupSecret: "known-secret",
    });

    expect(response.status).toBe(404);
  });

  it("provisions the first operator in development with the configured secret", async () => {
    const request = new Request("http://localhost/api/setup?secret=known-secret", {
      method: "POST",
    });
    const response = await bootstrapHandler(request, {
      nodeEnv: "development",
      setupSecret: "known-secret",
    });
    expect(response.status).toBe(201);
  });
});
