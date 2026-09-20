export function extractMentions(text: string): string[] {
  const found: string[] = [];
  const pattern = /(?:^|\s)@([a-z0-9_]+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (!found.includes(match[1]!)) found.push(match[1]!);
  }
  return found;
}
