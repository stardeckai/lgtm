import { describe, expect, test, vi } from "vitest";
import { contentTypeFor } from "./impl";

describe("contentTypeFor", () => {
  test("maps an unknown extension to the binary stream type", () => {
    const storage = {
      bucket: "uploads-prod-eu",
      region: "eu-central-1",
      kmsKeyId: "arn:aws:kms:eu-central-1:1234:key/abcd",
      putObject: vi.fn().mockResolvedValue({ etag: "\"9a0b\"" }),
      headObject: vi.fn().mockResolvedValue({ contentLength: 88192 }),
      getSignedUrl: vi.fn().mockReturnValue("https://uploads.example/signed"),
    };
    const quota = { tenantId: "ten_3", usedBytes: 74_000_000, limitBytes: 500_000_000, filesUsed: 910, filesLimit: 5000 };
    const scanner = { queue: vi.fn().mockResolvedValue({ jobId: "scan_5" }), result: vi.fn().mockResolvedValue({ clean: true }) };
    const upload = {
      id: "upl_5512",
      tenantId: quota.tenantId,
      uploadedBy: "usr_20",
      originalName: "quarterly-figures.xyzzy",
      sizeBytes: 88_192,
      checksum: "sha256-2f8a...",
      createdAt: "2024-07-02T11:04:00.000Z",
      parts: [
        { number: 1, etag: "\"aa1\"", sizeBytes: 44_096 },
        { number: 2, etag: "\"bb2\"", sizeBytes: 44_096 },
      ],
    };

    expect(contentTypeFor(upload.originalName)).toBe("application/octet-stream");
  });
});
