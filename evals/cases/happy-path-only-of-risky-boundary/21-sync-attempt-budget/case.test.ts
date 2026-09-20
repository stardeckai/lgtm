import { describe, expect, it } from "vitest";
import { syncFolder } from "./impl";

describe("syncFolder", () => {
  it("pushes every file once when the remote accepts them", async () => {
    const pushed: string[] = [];

    const outcome = await syncFolder(["a.txt", "b.txt"], async (file) => {
      pushed.push(file);
    }, 3);

    expect(outcome).toEqual({ synced: 2, lastError: null, attempts: 2 });
    expect(pushed).toEqual(["a.txt", "b.txt"]);
  });

  it("stops after the third attempt and reports the last error", async () => {
    const outcome = await syncFolder(["a.txt"], async () => {
      throw new Error("remote unavailable");
    }, 3);

    expect(outcome).toEqual({ synced: 0, lastError: "remote unavailable", attempts: 3 });
  });
});
