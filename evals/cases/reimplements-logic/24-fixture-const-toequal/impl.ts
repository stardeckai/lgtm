export type RawUpload = {
  key: string;
  bytes: number;
  contentType: string;
  uploadedAt: string;
  ownerId: string;
};

export type UploadSummary = {
  id: string;
  sizeLabel: string;
  kind: "image" | "document" | "other";
  isStale: boolean;
};

export function summariseUpload(raw: RawUpload, nowIso: string): UploadSummary {
  const mb = raw.bytes / (1024 * 1024);
  const sizeLabel = mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(raw.bytes / 1024)} KB`;
  const kind = raw.contentType.startsWith("image/")
    ? "image"
    : raw.contentType === "application/pdf"
      ? "document"
      : "other";
  const ageDays = (Date.parse(nowIso) - Date.parse(raw.uploadedAt)) / 86_400_000;
  return { id: raw.key.split("/").pop()!, sizeLabel, kind, isStale: ageDays > 30 };
}
