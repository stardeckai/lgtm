export type Mail = { to: string; subject: string; body: string };

function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export function renderHeaders(mail: Mail): string {
  return [`To: ${headerSafe(mail.to)}`, `Subject: ${headerSafe(mail.subject)}`, "MIME-Version: 1.0"].join("\r\n");
}
