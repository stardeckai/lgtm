export type Part = { name: string; filename?: string; contentType: string; body: string };

export function buildMultipart(boundary: string, parts: Part[]): string {
  const chunks = parts.map((part) => {
    const disposition = part.filename
      ? `form-data; name="${part.name}"; filename="${part.filename}"`
      : `form-data; name="${part.name}"`;
    return `--${boundary}\r\nContent-Disposition: ${disposition}\r\nContent-Type: ${part.contentType}\r\n\r\n${part.body}`;
  });
  return `${chunks.join("\r\n")}\r\n--${boundary}--\r\n`;
}

export function parseMultipart(boundary: string, body: string): Part[] {
  return body
    .split(`--${boundary}`)
    .map((chunk) => chunk.replace(/^\r\n/, "").replace(/\r\n$/, ""))
    .filter((chunk) => chunk !== "" && chunk !== "--")
    .map((chunk) => {
      const [head, ...rest] = chunk.split("\r\n\r\n");
      const headers = new Map(
        (head ?? "").split("\r\n").map((line) => {
          const at = line.indexOf(": ");
          return [line.slice(0, at).toLowerCase(), line.slice(at + 2)] as [string, string];
        }),
      );
      const disposition = headers.get("content-disposition") ?? "";
      const name = /name="([^"]*)"/.exec(disposition)?.[1] ?? "";
      const filename = /filename="([^"]*)"/.exec(disposition)?.[1];
      return {
        name,
        ...(filename ? { filename } : {}),
        contentType: headers.get("content-type") ?? "",
        body: rest.join("\r\n\r\n"),
      };
    });
}
