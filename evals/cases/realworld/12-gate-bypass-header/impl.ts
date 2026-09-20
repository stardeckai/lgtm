import { signGateBypass } from "./gate";

export async function fetchAppManifest(appId: string, workspaceId: string, baseUrl: string) {
  const secret = process.env.GATE_BYPASS_SECRET;
  if (!secret) throw new Error("GATE_BYPASS_SECRET is required");

  const response = await fetch(`${baseUrl}/api/manifest`, {
    method: "GET",
    redirect: "manual",
    headers: {
      "x-gate-bypass": signGateBypass(secret, appId, `manifest:${workspaceId}`),
    },
  });
  if (response.status >= 300 && response.status < 400) {
    throw new Error("manifest request hit the visibility gate");
  }
  return (await response.json()) as { routes: string[] };
}
