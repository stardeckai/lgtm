import { describe, expect, it } from "vitest";
import { escapeField, parseField } from "./impl";

describe("csv fields", () => {
  it("round-trips values containing commas, quotes and newlines", () => {
    const values = ['Smith, John', 'he said "hi"', "line one\nline two", "plain"];
    const escaped = values.map(escapeField);

    expect(escaped).toEqual([
      '"Smith, John"',
      '"he said ""hi"""',
      '"line one\nline two"',
      "plain",
    ]);
    expect(escaped.map(parseField)).toEqual(values);
  });
});
