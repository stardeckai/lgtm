import { describe, expect, test } from "vitest";
import { DEFAULT_CONFIG, parseConfig } from "./impl";

describe("parseConfig", () => {
  test("falls back to the defaults when the document cannot be read", () => {
    expect(parseConfig('{"retries": 7, "timeoutMs": 250,}')).toEqual(DEFAULT_CONFIG);
  });
});
