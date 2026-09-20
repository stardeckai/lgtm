import { describe, expect, it } from "vitest";
import { progressPercent, recordRow, startImport } from "./impl";

describe("progressPercent", () => {
  it("reports whole percent steps as rows are consumed and 100 for an empty file", () => {
    let job = startImport("imp_2", 3);
    expect(progressPercent(job)).toBe(0);

    job = recordRow(job, true);
    expect(progressPercent(job)).toBe(33);

    job = recordRow(job, false);
    job = recordRow(job, true);
    expect(progressPercent(job)).toBe(100);

    expect(progressPercent(startImport("imp_3", 0))).toBe(100);
  });
});
