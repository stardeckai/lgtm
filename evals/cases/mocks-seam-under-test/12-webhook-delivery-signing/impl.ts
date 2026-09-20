import { createHmac } from "node:crypto";

export interface Signer {
  sign(secret: string, body: string, timestamp: number): string;
}

export const hmacSigner: Signer = {
  sign(secret, body, timestamp) {
    const mac = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
    return `t=${timestamp},v1=${mac}`;
  },
};

export interface HttpClient {
  post(url: string, body: string, headers: Record<string, string>): Promise<{ status: number }>;
}

export type Endpoint = { url: string; secret: string };

export async function deliver(
  signer: Signer,
  http: HttpClient,
  endpoint: Endpoint,
  event: unknown,
  nowSeconds: number,
): Promise<{ status: number; signature: string }> {
  const body = JSON.stringify(event);
  const signature = signer.sign(endpoint.secret, body, nowSeconds);
  const { status } = await http.post(endpoint.url, body, { "x-signature": signature });
  return { status, signature };
}
