import { createHash } from "node:crypto";

export interface BlobStore {
  putPart(uploadId: string, index: number, bytes: Buffer): Promise<{ etag: string }>;
  complete(uploadId: string, etags: string[]): Promise<{ key: string; checksum: string }>;
}

export interface Metrics {
  timing(name: string, ms: number): void;
}

export interface Logger {
  info(message: string, fields: Record<string, unknown>): void;
}

export async function uploadParts(
  store: BlobStore,
  metrics: Metrics,
  logger: Logger,
  now: () => number,
  uploadId: string,
  parts: Buffer[],
): Promise<{ key: string; checksum: string }> {
  const startedAt = now();
  const etags: string[] = [];
  for (const [index, bytes] of parts.entries()) {
    const { etag } = await store.putPart(uploadId, index, bytes);
    etags.push(etag);
  }
  const result = await store.complete(uploadId, etags);
  const local = createHash("sha256").update(Buffer.concat(parts)).digest("hex");
  if (local !== result.checksum) throw new Error("checksum mismatch after upload");
  metrics.timing("upload.ms", now() - startedAt);
  logger.info("upload complete", { uploadId, parts: parts.length });
  return result;
}
