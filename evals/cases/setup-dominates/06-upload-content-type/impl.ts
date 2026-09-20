const BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  csv: "text/csv",
};

export function contentTypeFor(filename: string): string {
  const ext = filename.slice(filename.lastIndexOf(".") + 1).toLowerCase();
  return BY_EXTENSION[ext] ?? "application/octet-stream";
}

export function isInlineViewable(contentType: string): boolean {
  return contentType === "application/pdf" || contentType.startsWith("image/");
}
