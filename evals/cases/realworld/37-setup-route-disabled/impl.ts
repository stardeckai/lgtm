type Env = { nodeEnv: string; setupSecret?: string };

/**
 * The bootstrap route provisions the first operator account. It exists for
 * local development only; in production it must not be reachable even with a
 * correct secret, so it answers 404 rather than 401.
 */
export async function bootstrapHandler(request: Request, env: Env): Promise<Response> {
  if (env.nodeEnv === "production") {
    return new Response("Not found", { status: 404 });
  }
  const secret = new URL(request.url).searchParams.get("secret");
  if (!env.setupSecret || secret !== env.setupSecret) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json({ created: true }, { status: 201 });
}
