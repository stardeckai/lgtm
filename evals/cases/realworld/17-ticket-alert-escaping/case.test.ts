import { beforeEach, describe, expect, it, vi } from "vitest";

const postChatAlert = vi.fn();
vi.mock("./chat-alerts", () => ({ postChatAlert: (...args: unknown[]) => postChatAlert(...args) }));

import { sendTicketCreatedAlert, type Ticket } from "./impl";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sendTicketCreatedAlert", () => {
  it("escapes caller-controlled ticket fields before posting the alert", async () => {
    const ticket = {
      ticketNumber: 42,
      workspaceId: "ws_1",
      title: "Broken <!channel> <https://evil.example|dashboard>",
      priority: "p1",
    } as unknown as Ticket;

    await sendTicketCreatedAlert({
      ticket,
      apps: [{ appId: "app_1", appName: "Storefront <App>" }],
      accountName: "Northwind <https://evil.example|support>",
    });

    const [channel, text] = postChatAlert.mock.calls[0] as [string, string];
    expect(channel).toBe("tickets");
    expect(text).toContain("Broken &lt;!channel&gt; &lt;https://evil.example|dashboard&gt;");
    expect(text).toContain("Northwind &lt;https://evil.example|support&gt;");
    expect(text).toContain("Storefront &lt;App&gt;");
    expect(text).toContain("*Priority:* P1");
    expect(text).not.toContain("<!channel>");
  });
});
