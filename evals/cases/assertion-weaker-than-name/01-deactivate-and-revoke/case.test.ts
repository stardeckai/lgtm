import { describe, expect, it } from "vitest";
import { Directory } from "./impl";

describe("Directory.deactivate", () => {
  it("deactivates the user and revokes every session they still hold", () => {
    const directory = new Directory(
      [{ id: "u-1", active: true }],
      [
        { id: "s-1", userId: "u-1", revokedAtMs: null },
        { id: "s-2", userId: "u-1", revokedAtMs: null },
      ],
    );

    directory.deactivate("u-1", 9_000);

    expect(directory.userOf("u-1")?.active).toBe(false);
  });
});
