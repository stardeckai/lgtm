import { buildManifest } from "./manifest";
import { uploadBundle } from "./upload";
import { bumpVersion } from "./version";

export type Release = { appId: string; files: string[]; previousVersion: string };

export async function publishRelease(release: Release): Promise<{ version: string; manifestSize: number }> {
  const version = bumpVersion(release.previousVersion, release.files.length > 20 ? "minor" : "patch");
  const manifest = buildManifest(release.appId, release.files, version);
  await uploadBundle(release.appId, version, manifest);
  return { version, manifestSize: manifest.entries.length };
}
