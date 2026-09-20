import { describe, expect, it } from "vitest";
import { invoiceNumber, parseSequence } from "./impl";

describe("invoiceNumber", () => {
  it("issues a number the sequence can be read back from", () => {
    const number = invoiceNumber({ sequence: 42, issuedAt: new Date("2026-05-04T00:00:00Z") });

    expect(number).toBe("2026-INV-42");
    expect(parseSequence(number)).toBe(42);
  });
});
