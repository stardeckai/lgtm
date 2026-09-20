import path from "node:path";

export function attachmentPath(root: string, requested: string): string {
  const resolvedRoot = path.resolve(root);
  const candidate = path.resolve(resolvedRoot, requested);
  const relative = path.relative(resolvedRoot, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("attachment path escapes the storage root");
  }
  return candidate;
}
