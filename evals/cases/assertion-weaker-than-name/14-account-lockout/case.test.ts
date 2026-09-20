import { describe, expect, it } from "vitest";
import { recordFailure, type Account } from "./impl";

describe("recordFailure", () => {
  it("locks the account once five sign-in attempts have failed", () => {
    let account: Account = { email: "ada@example.com", failedAttempts: 0, lockedUntilMs: null };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      account = recordFailure(account, 1_000);
    }

    expect(account.failedAttempts).toBe(5);
  });
});
