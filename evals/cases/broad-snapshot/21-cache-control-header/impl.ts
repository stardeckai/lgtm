export type Resource = { public: boolean; maxAgeSeconds: number; staleWhileRevalidateSeconds?: number; mutable: boolean };

export function cacheControl(resource: Resource): string {
  if (!resource.mutable) return "public, max-age=31536000, immutable";
  const directives = [resource.public ? "public" : "private", `max-age=${resource.maxAgeSeconds}`];
  if (resource.staleWhileRevalidateSeconds !== undefined) {
    directives.push(`stale-while-revalidate=${resource.staleWhileRevalidateSeconds}`);
  }
  if (!resource.public) directives.push("no-store");
  return directives.join(", ");
}
