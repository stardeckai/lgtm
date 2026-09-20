export interface ObjectStore {
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  head(key: string): Promise<{ size: number } | null>;
}

export type Upload = { orgId: string; fileName: string; bytes: Uint8Array; kind: "avatar" | "receipt" };

const TYPES: Record<string, string> = { png: "image/png", jpg: "image/jpeg", pdf: "application/pdf" };

export async function storeUpload(store: ObjectStore, upload: Upload): Promise<string> {
  const ext = upload.fileName.split(".").pop()!.toLowerCase();
  const contentType = TYPES[ext];
  if (!contentType) throw new Error(`unsupported extension ${ext}`);
  const safe = upload.fileName.replace(/[^a-z0-9.\-]+/gi, "-").toLowerCase();
  const key = `${upload.orgId}/${upload.kind}s/${safe}`;
  if (await store.head(key)) throw new Error("already uploaded");
  await store.put(key, upload.bytes, contentType);
  return key;
}
