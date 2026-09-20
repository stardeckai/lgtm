import { describe, expect, it } from "vitest";
import { toCsvRow } from "./impl";

const fields = ['Acme, Inc.', 'he said "hi"', "plain", " padded ", "line\nbreak"];

describe("toCsvRow", () => {
  it("quotes fields containing the delimiter, quotes, newlines or padding", () => {
    const expected = fields
      .map((field) => {
        const mustQuote =
          field.includes(",") || field.includes('"') || /[\r\n]/.test(field) || field !== field.trim();
        return mustQuote ? `"${field.replace(/"/g, '""')}"` : field;
      })
      .join(",");

    expect(toCsvRow(fields)).toBe(expected);
  });
});
