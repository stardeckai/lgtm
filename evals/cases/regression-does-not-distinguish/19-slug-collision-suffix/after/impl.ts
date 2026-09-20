export class SlugBook {
  private taken = new Set<string>();

  claim(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    let candidate = base;
    let counter = 2;
    while (this.taken.has(candidate)) candidate = `${base}-${counter++}`;
    this.taken.add(candidate);
    return candidate;
  }
}
