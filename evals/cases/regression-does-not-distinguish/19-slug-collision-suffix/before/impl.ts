export class SlugBook {
  private taken = new Set<string>();

  claim(title: string): string {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    this.taken.add(base);
    return base;
  }
}
