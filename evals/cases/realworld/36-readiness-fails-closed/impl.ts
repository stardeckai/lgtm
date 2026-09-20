export class CatalogClientError extends Error {
  constructor(
    message: string,
    readonly category: "unavailable" | "forbidden",
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "CatalogClientError";
  }
}

export type Readiness = {
  ready: boolean;
  upstreamDataReady: boolean;
  consumerHealthy: boolean;
  catalogVersion?: string;
  catalogStatus?: string;
};

export interface CatalogClient {
  getReadiness(): Promise<Readiness>;
}

/** Pricing must fail closed: an unreadable upstream is not a ready catalog. */
export async function readinessResponse(client: CatalogClient): Promise<Response> {
  let readiness: Readiness;
  try {
    readiness = await client.getReadiness();
  } catch (error) {
    const category = error instanceof CatalogClientError ? error.category : "unavailable";
    return Response.json(
      { ready: false, upstreamDataReady: false, consumerHealthy: false, catalogStatus: category },
      { status: 503 },
    );
  }
  return Response.json(readiness, { status: readiness.ready ? 200 : 503 });
}
