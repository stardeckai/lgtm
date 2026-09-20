import crypto from "crypto";

export type OutboundCall = {
  method: string;
  path: string;
  body: string;
  timestamp: number;
};

export function canonicalString(call: OutboundCall): string {
  return [call.method.toUpperCase(), call.path, String(call.timestamp), call.body].join("\n");
}

export function signCall(secret: string, call: OutboundCall): string {
  return crypto.createHmac("sha256", secret).update(canonicalString(call)).digest("hex");
}
