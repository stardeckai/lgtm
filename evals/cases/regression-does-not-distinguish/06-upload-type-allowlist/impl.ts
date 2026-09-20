const ALLOWED = new Set(["image/png", "image/jpeg", "application/pdf"]);

export type Upload = { filename: string; contentType: string; bytes: number };

export function checkUpload(upload: Upload): { ok: boolean; reason?: string } {
  if (upload.bytes > 10 * 1024 * 1024) return { ok: false, reason: "too large" };
  if (!ALLOWED.has(upload.contentType)) return { ok: false, reason: "unsupported type" };
  return { ok: true };
}
