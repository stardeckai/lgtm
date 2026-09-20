import { describe, expect, it } from "vitest";
import { isLocked, recordFailure, type Account } from "./impl";

describe("recordFailure", () => {
  it("leaves the account open after four failures and locks it for 15 minutes on the fifth", () => {
    let account: Account = { email: "ada@example.com", failedAttempts: 0, lockedUntilMs: null };

    for (let attempt = 0; attempt < 4; attempt += 1) {
      account = recordFailure(account, 1_000);
    }
    expect(isLocked(account, 1_000)).toBe(false);

    account = recordFailure(account, 1_000);
    expect(account.lockedUntilMs).toBe(901_000);
    expect(isLocked(account, 900_999)).toBe(true);
    expect(isLocked(account, 901_000)).toBe(false);
  });
});
