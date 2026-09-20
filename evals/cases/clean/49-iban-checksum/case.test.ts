import { describe, expect, it } from "vitest";
import { checkDigits, isValidIban } from "./impl";

describe("isValidIban", () => {
  it("accepts a spaced account number, rejects one transposed digit and computes the check digits", () => {
    expect(isValidIban("DE89 3704 0044 0532 0130 00")).toBe(true);
    expect(isValidIban("DE89370400440532013000")).toBe(true);
    expect(isValidIban("DE89370400440532013100")).toBe(false);
    expect(isValidIban("DE99370400440532013000")).toBe(false);
    expect(isValidIban("DE8937040044053201300")).toBe(false);
    expect(checkDigits("DE", "370400440532013000")).toBe("89");
  });
});
