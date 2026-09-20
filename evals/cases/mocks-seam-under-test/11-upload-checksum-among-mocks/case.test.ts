import { describe, expect, it, vi } from "vitest";
import { uploadParts, type BlobStore, type Logger, type Metrics } from "./impl";

const metrics: Metrics = { timing: vi.fn() };
const logger: Logger = { info: vi.fn() };
const clock = vi.fn().mockReturnValueOnce(1000).mockReturnValueOnce(1450);

describe("uploadParts", () => {
  it("accepts the upload when the stored checksum matches the bytes that were sent", async () => {
    const store: BlobStore = {
      putPart: vi.fn().mockResolvedValue({ etag: "e1" }),
      complete: vi.fn().mockResolvedValue({ key: "u/1", checksum: "5e3235a8346e5a4585f8c58562f5052b8fe26a3bb122e1e96c76784964dfc461" }),
    };

    const result = await uploadParts(store, metrics, logger, clock, "up_1", [Buffer.from("hello ")]);

    expect(result.key).toBe("u/1");
    expect(metrics.timing).toHaveBeenCalledWith("upload.ms", 450);
  });
});
