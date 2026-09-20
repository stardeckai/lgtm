import { describe, expect, it } from "vitest";
import { diffConfig, revert, type Config } from "./impl";

describe("diffConfig", () => {
  it("describes an added, a changed and a removed key well enough to undo all three", () => {
    const before: Config = { region: "eu", replicas: 2, debug: false };
    const after: Config = { region: "eu", replicas: 5, canary: true };

    const changes = diffConfig(before, after);

    expect(changes).toEqual([
      { key: "canary", to: true },
      { key: "debug", from: false },
      { key: "replicas", from: 2, to: 5 },
    ]);
    expect(revert(after, changes)).toEqual(before);
  });
});
