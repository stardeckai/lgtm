export type Patch =
  | { op: "set"; path: string; value: unknown }
  | { op: "remove"; path: string };

export type Doc = Record<string, unknown>;

export function applyPatch(doc: Doc, patch: Patch[]): Doc {
  const next: Doc = { ...doc };
  for (const step of patch) {
    if (step.op === "set") next[step.path] = step.value;
    else delete next[step.path];
  }
  return next;
}

export function invertPatch(doc: Doc, patch: Patch[]): Patch[] {
  const inverse: Patch[] = [];
  for (const step of patch) {
    if (Object.prototype.hasOwnProperty.call(doc, step.path)) {
      inverse.unshift({ op: "set", path: step.path, value: doc[step.path] });
    } else {
      inverse.unshift({ op: "remove", path: step.path });
    }
  }
  return inverse;
}
