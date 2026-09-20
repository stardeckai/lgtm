export type Mail = { to: string; subject: string; body: string };

export function renderHeaders(mail: Mail): string {
  return [`To: ${mail.to}`, `Subject: ${mail.subject}`, "MIME-Version: 1.0"].join("\r\n");
}
