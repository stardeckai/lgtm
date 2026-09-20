import { describe, expect, it } from "vitest";
import { summariseUpload, type RawUpload, type UploadSummary } from "./impl";

const raw: RawUpload = {
  key: "org_7/uploads/receipt-2024-04.pdf",
  bytes: 2_306_867,
  contentType: "application/pdf",
  uploadedAt: "2024-04-02T09:30:00.000Z",
  ownerId: "u_19",
};

const expected: UploadSummary = {
  id: "receipt-2024-04.pdf",
  sizeLabel: "2.2 MB",
  kind: "document",
  isStale: true,
};

describe("summariseUpload", () => {
  it("labels a two-month-old pdf as a stale document", () => {
    expect(summariseUpload(raw, "2024-06-01T09:30:00.000Z")).toEqual(expected);
  });
});
