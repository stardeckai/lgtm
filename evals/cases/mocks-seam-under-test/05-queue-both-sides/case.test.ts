import { describe, expect, it, vi } from "vitest";
import { enqueueExport, runNextExport, type Queue } from "./impl";

describe("export jobs", () => {
  it("delivers to the worker the payload the producer published", async () => {
    const queue: Queue = {
      publish: vi.fn().mockResolvedValue(undefined),
      reserve: vi.fn().mockResolvedValue({
        id: "job_org7_csv",
        type: "export.requested",
        payload: JSON.stringify({ orgId: "org7", format: "csv" }),
        attempts: 0,
      }),
    };

    await enqueueExport(queue, "org7", "csv");
    const rendered = await runNextExport(queue, (orgId, format) => `${orgId}.${format}`);

    expect(rendered).toBe("org7.csv");
  });
});
