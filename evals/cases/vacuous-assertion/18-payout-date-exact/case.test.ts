import { describe, expect, it } from "vitest";
import { releaseIso } from "./impl";

describe("releaseIso", () => {
  it("pushes a hold that lands on a Saturday to the following Monday", () => {
    const date = releaseIso({ accountId: "acct_1", capturedIso: "2026-03-03", country: "DE" });

    expect(date).toBeDefined();
    expect(date).toBe("2026-03-09");
    expect(releaseIso({ accountId: "acct_1", capturedIso: "2026-03-02", country: "US" })).toBe("2026-03-04");
  });
});
