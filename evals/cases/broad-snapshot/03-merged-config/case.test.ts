import { describe, expect, it } from "vitest";
import { mergeConfig } from "./impl";

describe("mergeConfig", () => {
  it("merges a nested override one level deep instead of replacing the branch", () => {
    expect(mergeConfig({ database: { poolMax: 40 }, logLevel: "debug" })).toMatchSnapshot();
  });
});
