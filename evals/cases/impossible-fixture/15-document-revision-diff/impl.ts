export type Revision = { number: number; authorId: string; body: string };

export class RevisionLog {
  private revisions: Revision[] = [];

  append(authorId: string, body: string): Revision {
    const revision = { number: this.revisions.length + 1, authorId, body };
    this.revisions.push(revision);
    return revision;
  }

  restore(revisions: Revision[]): void {
    this.revisions = [...revisions];
  }

  at(number: number): Revision | null {
    return this.revisions.find((revision) => revision.number === number) ?? null;
  }

  changedLinesBetween(from: number, to: number): number {
    const a = this.at(from);
    const b = this.at(to);
    if (!a || !b) return 0;
    const left = a.body.split("\n");
    const right = b.body.split("\n");
    let changed = 0;
    for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
      if (left[i] !== right[i]) changed += 1;
    }
    return changed;
  }
}
