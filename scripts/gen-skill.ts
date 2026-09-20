import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { checksTable, SKILLS } from "../src/skill.js";

for (const { name, markdown } of SKILLS) {
  const dir = fileURLToPath(new URL(`../skills/${name}/`, import.meta.url));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(`${dir}SKILL.md`, markdown());
  console.log(`wrote ${dir}SKILL.md`);
}

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
