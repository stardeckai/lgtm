export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly context: Record<string, unknown>,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export function toErrorEnvelope(err: unknown, requestId: string) {
  const isDomain = err instanceof DomainError;
  const base = err instanceof Error ? err : new Error(String(err));
  return {
    requestId,
    code: isDomain ? err.code : "internal_error",
    message: isDomain ? base.message : "Something went wrong",
    context: isDomain ? err.context : {},
    name: base.name,
    stack: base.stack,
    retryable: isDomain ? err.code === "rate_limited" : true,
  };
}
