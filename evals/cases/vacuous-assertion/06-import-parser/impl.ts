export type Row = { email: string; fullName: string; amountCents: number };

export function parseImport(text: string): Row[] {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const [, ...body] = lines;
  return body.map((line, index) => {
    const [email, fullName, amount] = line.split(",");
    if (!email || !email.includes("@")) throw new Error(`row ${index + 1}: bad email`);
    const amountCents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(amountCents)) throw new Error(`row ${index + 1}: bad amount`);
    return { email: email.trim().toLowerCase(), fullName: (fullName ?? "").trim(), amountCents };
  });
}
