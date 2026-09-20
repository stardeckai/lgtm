export type Upload = { name: string; mime: string; bytes: number };
export type Quota = { usedBytes: number; limitBytes: number };

const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "application/pdf"]);

export function acceptUpload(quota: Quota, upload: Upload): Quota {
  if (!ALLOWED_MIME.has(upload.mime)) throw new Error(`unsupported type ${upload.mime}`);
  if (upload.bytes <= 0) throw new Error("empty upload");
  if (quota.usedBytes + upload.bytes > quota.limitBytes) {
    throw new Error("storage quota exceeded");
  }
  return { ...quota, usedBytes: quota.usedBytes + upload.bytes };
}
