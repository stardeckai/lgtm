import { createHash } from "node:crypto";

export type Asset = { name: string; contents: string; entry: boolean };
export type ManifestEntry = { file: string; integrity: string; sizeBytes: number; isEntry: boolean };

export function buildManifest(assets: Asset[]): Record<string, ManifestEntry> {
  const manifest: Record<string, ManifestEntry> = {};
  for (const asset of assets) {
    const hash = createHash("sha256").update(asset.contents).digest("hex").slice(0, 8);
    const dot = asset.name.lastIndexOf(".");
    manifest[asset.name] = {
      file: `${asset.name.slice(0, dot)}.${hash}${asset.name.slice(dot)}`,
      integrity: `sha256-${hash}`,
      sizeBytes: Buffer.byteLength(asset.contents),
      isEntry: asset.entry,
    };
  }
  return manifest;
}
