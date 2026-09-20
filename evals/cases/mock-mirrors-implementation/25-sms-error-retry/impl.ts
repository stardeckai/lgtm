export class ProviderError extends Error {
  constructor(readonly code: string, readonly httpStatus: number) {
    super(`${code} (${httpStatus})`);
    this.name = "ProviderError";
  }
}

export interface SmsProvider {
  send(to: string, body: string): Promise<{ sid: string }>;
}

export type Attempted = { delivered: boolean; retryable: boolean; failureCode: string | null };

const PERMANENT = new Set(["21610", "21614", "21211"]);

export async function attemptSend(provider: SmsProvider, to: string, body: string): Promise<Attempted> {
  try {
    await provider.send(to, body);
    return { delivered: true, retryable: false, failureCode: null };
  } catch (error) {
    if (!(error instanceof ProviderError)) throw error;
    return {
      delivered: false,
      retryable: !PERMANENT.has(error.code) && error.httpStatus >= 500,
      failureCode: error.code,
    };
  }
}
