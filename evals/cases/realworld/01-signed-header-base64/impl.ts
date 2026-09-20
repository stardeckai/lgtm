import crypto from "crypto";

export type RequestClaims = {
  workspaceId: string;
  appId: string;
  releaseId: string;
};

export function signOutboundRequest(secret: string, claims: RequestClaims): string {
  const payload = {
    type: "outbound-request",
    workspaceId: claims.workspaceId,
    appId: claims.appId,
    releaseId: claims.releaseId,
    timestamp: Math.floor(Date.now() / 1000),
    nonce: crypto.randomBytes(8).toString("hex"),
  };
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json, "utf-8").toString("base64");
  const signature = crypto.createHmac("sha256", secret).update(json).digest("hex");
  return `${encoded}.${signature}`;
}
