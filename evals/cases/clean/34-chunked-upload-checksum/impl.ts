import { createHash } from "node:crypto";

export type Chunk = { index: number; data: Buffer };

export function chunkChecksum(chunk: Chunk): string {
  return createHash("sha256").update(chunk.data).digest("hex").slice(0, 16);
}

export class UploadSession {
  private chunks = new Map<number, { data: Buffer; checksum: string }>();

  constructor(readonly totalChunks: number) {}

  put(chunk: Chunk, declaredChecksum: string): "stored" | "checksum mismatch" {
    if (chunkChecksum(chunk) !== declaredChecksum) return "checksum mismatch";
    this.chunks.set(chunk.index, { data: chunk.data, checksum: declaredChecksum });
    return "stored";
  }

  complete(): { body: Buffer; digest: string } | { missing: number[] } {
    const missing = Array.from({ length: this.totalChunks }, (_, i) => i).filter((i) => !this.chunks.has(i));
    if (missing.length > 0) return { missing };
    const ordered = Array.from({ length: this.totalChunks }, (_, i) => this.chunks.get(i)!.data);
    const body = Buffer.concat(ordered);
    return { body, digest: createHash("sha256").update(body).digest("hex") };
  }
}
