export interface HttpClient {
  post(url: string, body: unknown): Promise<{ status: number; headers: Record<string, string>; body: string }>;
}

export type SendResult =
  | { kind: "delivered"; messageId: string }
  | { kind: "throttled"; retryAfterSeconds: number }
  | { kind: "rejected"; reason: string };

export async function sendCampaign(client: HttpClient, listId: string): Promise<SendResult> {
  const response = await client.post("https://api.mail.example/send", { listId });
  if (response.status === 202) {
    return { kind: "delivered", messageId: JSON.parse(response.body).id as string };
  }
  if (response.status === 429) {
    const header = response.headers["retry-after"];
    return { kind: "throttled", retryAfterSeconds: header ? Number(header) : 60 };
  }
  return { kind: "rejected", reason: `upstream ${response.status}` };
}
