import { createHash } from "node:crypto";

export type FieldSchema = { key: string; label: string; required: boolean };
export type DocumentSchema = { slug: string; version: number; fields: FieldSchema[] };

/** Key order must not change the hash: two publishers write the same document. */
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonicalize(v)]),
    );
  }
  return value;
}

export function computeContentHash(schema: DocumentSchema): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(schema))).digest("hex");
}

export type PublishedVersion = { id: string; schemaSnapshot: DocumentSchema; contentHash: string };

export function publishVersion(id: string, schema: DocumentSchema): PublishedVersion {
  return { id, schemaSnapshot: schema, contentHash: computeContentHash(schema) };
}
