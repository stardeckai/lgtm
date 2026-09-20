import { describe, expect, it } from "vitest";
import { truncateForSms } from "./impl";

describe("truncateForSms", () => {
  it("trims a long message to 160 characters without cutting a word in half", () => {
    const message = `${"alpha bravo charlie delta ".repeat(20)}end`;

    const result = truncateForSms(message);

    expect(result.length).toBeLessThanOrEqual(160);
    expect(result.endsWith("…")).toBe(true);
  });
});
