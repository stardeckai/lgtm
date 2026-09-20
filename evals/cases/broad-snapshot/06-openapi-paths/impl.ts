export type Route = { method: string; path: string; summary: string; auth: boolean };

export function buildOpenApiPaths(routes: Route[]): Record<string, Record<string, unknown>> {
  const paths: Record<string, Record<string, unknown>> = {};
  for (const route of routes) {
    const key = route.path.replace(/:(\w+)/g, "{$1}");
    paths[key] ??= {};
    paths[key]![route.method.toLowerCase()] = {
      summary: route.summary,
      operationId: `${route.method.toLowerCase()}${key.replace(/[^a-zA-Z]/g, "")}`,
      security: route.auth ? [{ bearerAuth: [] }] : [],
      responses: { "200": { description: "OK" }, "401": { description: "Unauthorized" } },
    };
  }
  return paths;
}
