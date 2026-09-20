import { describe, expect, it } from "vitest";
import { mergeConfig } from "./impl";

describe("mergeConfig", () => {
  it("merges nested override objects into the nested defaults key by key", () => {
    const merged = mergeConfig(
      { region: "eu-west-1", retries: 3, debug: false },
      { retries: 5, debug: true },
    );

    expect(merged).toEqual({ region: "eu-west-1", retries: 5, debug: true });
  });
});
