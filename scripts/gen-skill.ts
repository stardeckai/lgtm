import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { checksTable, skillMarkdown } from "../src/skill.js";

const skill = fileURLToPath(new URL("../skills/lgtm/SKILL.md", import.meta.url));
fs.mkdirSync(fileURLToPath(new URL("../skills/lgtm/", import.meta.url)), { recursive: true });
fs.writeFileSync(skill, skillMarkdown());
console.log(`wrote ${skill}`);

// The README checks table comes from the same source, between markers, so blurbs cannot drift.
const readme = fileURLToPath(new URL("../README.md", import.meta.url));
const src = fs.readFileSync(readme, "utf8");
const start = "<!-- checks:start -->";
const end = "<!-- checks:end -->";
if (!src.includes(start) || !src.includes(end)) throw new Error("README.md is missing the checks markers");
const next = src.slice(0, src.indexOf(start) + start.length) + "\n" + checksTable() + "\n" + src.slice(src.indexOf(end));
if (next !== src) {
  fs.writeFileSync(readme, next);
  console.log(`updated ${readme}`);
}
