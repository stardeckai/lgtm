import { postChatAlert } from "./chat-alerts";

export type Ticket = {
  ticketNumber: number;
  workspaceId: string;
  title: string;
  type: string;
  priority: "p1" | "p2" | "p3";
  severity: string;
  dueAt: string | null;
  coverage: string;
  estimate: number | null;
};

const PRIORITY_LABELS: Record<Ticket["priority"], string> = { p1: "P1", p2: "P2", p3: "P3" };

function escapeMarkup(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendTicketCreatedAlert(args: {
  ticket: Ticket;
  apps: { appId: string; appName: string }[];
  accountName: string;
}): Promise<void> {
  const lines = [
    `*New ticket #${args.ticket.ticketNumber}:* ${escapeMarkup(args.ticket.title)}`,
    `*Account:* ${escapeMarkup(args.accountName)}`,
    `*Apps:* ${args.apps.map((a) => escapeMarkup(a.appName)).join(", ")}`,
    `*Priority:* ${PRIORITY_LABELS[args.ticket.priority]}`,
  ];
  await postChatAlert("tickets", lines.join("\n"));
}
