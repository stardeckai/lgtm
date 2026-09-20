const MAGIC: Array<{ bytes: number[]; type: string }> = [
  { bytes: [0x89, 0x50, 0x4e, 0x47], type: "image/png" },
  { bytes: [0xff, 0xd8, 0xff], type: "image/jpeg" },
  { bytes: [0x25, 0x50, 0x44, 0x46], type: "application/pdf" },
];

const BY_EXTENSION: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  pdf: "application/pdf",
};

export function detectContentType(filename: string, head: Uint8Array): string {
  for (const entry of MAGIC) {
    if (entry.bytes.every((byte, index) => head[index] === byte)) return entry.type;
  }
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  return BY_EXTENSION[extension] ?? "application/octet-stream";
}
