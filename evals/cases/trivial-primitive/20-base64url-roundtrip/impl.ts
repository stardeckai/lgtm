export function base64UrlEncode(input: Uint8Array): string {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = padded.length % 4;
  return new Uint8Array(
    Buffer.from(remainder === 0 ? padded : padded + "=".repeat(4 - remainder), "base64"),
  );
}
