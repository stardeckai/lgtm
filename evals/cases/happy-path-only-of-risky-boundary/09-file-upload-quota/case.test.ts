import { describe, expect, it } from "vitest";
import { acceptUpload, type Quota } from "./impl";

const quota: Quota = { usedBytes: 1_000, limitBytes: 10_000 };

describe("acceptUpload", () => {
  it("adds the uploaded bytes to the space already used", () => {
    expect(acceptUpload(quota, { name: "plan.pdf", mime: "application/pdf", bytes: 2_500 })).toEqual({
      usedBytes: 3_500,
      limitBytes: 10_000,
    });
  });

  it("rejects a file type that is not on the allow list", () => {
    expect(() =>
      acceptUpload(quota, { name: "run.exe", mime: "application/x-msdownload", bytes: 10 }),
    ).toThrow("unsupported type application/x-msdownload");
  });

  it("accepts a png as well as a pdf", () => {
    expect(acceptUpload(quota, { name: "shot.png", mime: "image/png", bytes: 500 }).usedBytes).toBe(1_500);
  });
});
