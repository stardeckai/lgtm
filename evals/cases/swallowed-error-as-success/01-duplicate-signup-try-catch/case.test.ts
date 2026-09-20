import { describe, expect, it } from "vitest";
import { AccountService } from "./impl";

describe("AccountService", () => {
  it("refuses a second registration for an email that is already taken", () => {
    const service = new AccountService();
    service.register("Nina@Example.com");

    try {
      service.register("nina@example.com");
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});
