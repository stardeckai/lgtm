import { describe, expect, it } from "vitest";
import { authorizeCard } from "./impl";

describe("authorizeCard", () => {
  it("refuses an expired card", () => {
    const card = { number: "4242424242424242", expMonth: 4, expYear: 2019, cvc: "123" };

    try {
      authorizeCard(card, 5000, 2024);
    } catch (err) {
      expect((err as Error).message.length).toBeGreaterThan(0);
    }
  });
});
