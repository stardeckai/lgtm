import { describe, expect, it } from "vitest";
import { apiBaseUrl } from "./impl";

describe("apiBaseUrl", () => {
  it("returns the base url configured for each environment", () => {
    expect(apiBaseUrl("local")).toBe("http://localhost:3000");
    expect(apiBaseUrl("staging")).toBe("https://staging.api.example.com");
    expect(apiBaseUrl("production")).toBe("https://api.example.com");
  });
});
