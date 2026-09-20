import { describe, expect, it } from "vitest";
import { isValidAccount } from "./impl";

const weights = [8, 6, 4, 2, 3, 5, 9, 7];
const base = "40718392";

describe("isValidAccount", () => {
  it("accepts a number whose ninth digit matches the weighted modulo-eleven checksum", () => {
    const sum = [...base].reduce((acc, char, index) => acc + Number(char) * weights[index]!, 0);
    const remainder = sum % 11;
    const check = remainder === 0 ? 0 : 11 - remainder;

    expect(isValidAccount(`${base}${check}`)).toBe(true);
  });
});
