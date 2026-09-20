import { createHmac } from "node:crypto";

export interface SignatureVerifier {
  verify(body: string, header: string): boolean;
}

export class HmacVerifier implements SignatureVerifier {
  constructor(private readonly secret: string) {}
  verify(body: string, header: string): boolean {
    const expected = createHmac("sha256", this.secret).update(body).digest("hex");
    return header === `sha256=${expected}`;
  }
}

export type Reply = { status: number; body: string };

export function handleWebhook(
  verifier: SignatureVerifier,
  body: string,
  header: string,
  apply: (event: unknown) => void,
): Reply {
  if (!verifier.verify(body, header)) return { status: 401, body: "bad signature" };
  apply(JSON.parse(body));
  return { status: 200, body: "ok" };
}
