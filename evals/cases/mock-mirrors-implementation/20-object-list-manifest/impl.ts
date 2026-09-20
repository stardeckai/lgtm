export interface ObjectStore {
  list(prefix: string): Promise<Array<{ key: string; size: number; etag: string }>>;
}

export type Manifest = {
  prefix: string;
  fileCount: number;
  totalBytes: number;
  largestKey: string;
  partials: string[];
};

export async function buildManifest(store: ObjectStore, prefix: string): Promise<Manifest> {
  const objects = await store.list(prefix);
  const complete = objects.filter((o) => !o.key.endsWith(".part"));
  const sorted = [...complete].sort((a, b) => b.size - a.size);
  return {
    prefix,
    fileCount: complete.length,
    totalBytes: complete.reduce((sum, o) => sum + o.size, 0),
    largestKey: sorted[0]?.key ?? "",
    partials: objects.filter((o) => o.key.endsWith(".part")).map((o) => o.key),
  };
}
