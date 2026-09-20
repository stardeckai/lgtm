export type Entry = { account: string; deltaMinor: number };
export type JournalLine = { ref: string; entries: Entry[] };

export class Journal {
  private lines: JournalLine[] = [];

  post(line: JournalLine): void {
    const sum = line.entries.reduce((total, entry) => total + entry.deltaMinor, 0);
    if (sum !== 0) throw new RangeError(`journal line ${line.ref} does not balance`);
    this.lines.push(line);
  }

  all(): JournalLine[] {
    return [...this.lines];
  }
}

export function balances(journal: Journal): Record<string, number> {
  const out: Record<string, number> = {};
  for (const line of journal.all()) {
    for (const entry of line.entries) {
      out[entry.account] = (out[entry.account] ?? 0) + entry.deltaMinor;
    }
  }
  return out;
}
