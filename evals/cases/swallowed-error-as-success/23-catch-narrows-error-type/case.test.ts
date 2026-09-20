import { describe, expect, it } from "vitest";
import { QuotaExceeded, UploadGate } from "./impl";

describe("UploadGate", () => {
  it("stops the upload that would cross the daily quota and does not count it", () => {
    const gate = new UploadGate({ uploadsPerDay: 2 });
    gate.accept(1024);
    gate.accept(2048);

    expect.assertions(3);
    try {
      gate.accept(4096);
    } catch (err) {
      if (!(err instanceof QuotaExceeded)) throw err;
      expect(err.limit).toBe(2);
      expect(err.used).toBe(2);
    }

    expect(gate.usedToday()).toBe(2);
  });
});
