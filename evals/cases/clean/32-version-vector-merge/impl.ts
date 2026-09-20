export type Replica = string;
export type Version = Record<Replica, number>;
export type Doc = { value: string; version: Version };

export function bump(version: Version, replica: Replica): Version {
  return { ...version, [replica]: (version[replica] ?? 0) + 1 };
}

export function compare(a: Version, b: Version): "before" | "after" | "equal" | "concurrent" {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let aAhead = false;
  let bAhead = false;
  for (const key of keys) {
    const left = a[key] ?? 0;
    const right = b[key] ?? 0;
    if (left > right) aAhead = true;
    if (right > left) bAhead = true;
  }
  if (aAhead && bAhead) return "concurrent";
  if (aAhead) return "after";
  if (bAhead) return "before";
  return "equal";
}

export function merge(mine: Doc, theirs: Doc): Doc | { conflict: [Doc, Doc] } {
  const order = compare(mine.version, theirs.version);
  if (order === "after" || order === "equal") return mine;
  if (order === "before") return theirs;
  return { conflict: [mine, theirs] };
}
