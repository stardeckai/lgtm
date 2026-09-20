export class MediaValidationError extends Error {
  constructor(key: string) {
    super(`Invalid media key: ${key}`);
    this.name = "MediaValidationError";
  }
}

const ALLOWED_NAMESPACES = ["sessions", "avatars", "documents"];

export function validateMediaKey(key: string): string {
  const segments = key.split("/");
  if (segments.length !== 2) throw new MediaValidationError(key);
  const [namespace, name] = segments as [string, string];
  if (!ALLOWED_NAMESPACES.includes(namespace)) throw new MediaValidationError(key);
  if (name.includes("..") || name.startsWith(".") || !/^[\w.-]+$/.test(name)) {
    throw new MediaValidationError(key);
  }
  return key;
}

export interface BlobStore {
  getDownloadUrl(storageKey: string): Promise<{ downloadUrl: string }>;
}

export async function getMediaDownloadUrl(store: BlobStore, key: string): Promise<string> {
  const { downloadUrl } = await store.getDownloadUrl(validateMediaKey(key));
  return downloadUrl;
}
