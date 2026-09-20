import fs from "node:fs";
import path from "node:path";

/** gitignore-style patterns from `.lgtmignore` (cwd) plus --ignore, e.g. `evals/`, a `fixtures` dir at any depth, `*.stories.test.ts`. */
export function ignoreMatcher(extra: string[], cwd = process.cwd()): (file: string) => boolean {
  const file = path.join(cwd, ".lgtmignore");
  const lines = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split("\n") : [];
  const patterns = [...lines, ...extra].map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const regexes = patterns.map((pat) => {
    const dirOnly = pat.endsWith("/");
    let p = pat.replace(/^\.?\//, "").replace(/\/$/, "");
    const anchored = p.includes("/");
    // placeholders first: the regex fragments for ** contain `*` and `?`, which the later steps would mangle
    p = p
      .replace(/[.+^${}()|[\]\\]/g, "\\$&")
      .replace(/\*\*\//g, "\u0000D")
      .replace(/\*\*/g, "\u0000A")
      .replace(/\*/g, "[^/]*")
      .replace(/\?/g, "[^/]")
      .replace(/\u0000D/g, "(?:.*/)?")
      .replace(/\u0000A/g, ".*");
    // a bare name matches at any depth; a path with a slash matches from the root; both match the subtree
    return new RegExp(`^${anchored ? "" : "(?:.*/)?"}${p}${dirOnly ? "/" : "(?:/|$)"}`);
  });
  return (f) => {
    const rel = path.relative(cwd, path.resolve(cwd, f)).split(path.sep).join("/");
    return regexes.some((r) => r.test(rel));
  };
}

