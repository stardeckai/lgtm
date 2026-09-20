export function encodeHeaderWord(value: string): string {
  if (/^[\x20-\x7e]*$/.test(value) && !value.includes("=?")) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

export function decodeHeaderWord(value: string): string {
  const match = /^=\?UTF-8\?([BQ])\?(.*)\?=$/.exec(value);
  if (!match) return value;
  if (match[1] === "B") return Buffer.from(match[2]!, "base64").toString("utf8");
  return match[2]!.replace(/_/g, " ").replace(/=([0-9A-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)));
}

export function subjectHeader(subject: string): string {
  return `Subject: ${encodeHeaderWord(subject)}`;
}
