import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { skillMarkdown } from "../src/skill.js";

const out = fileURLToPath(new URL("../skills/lgtm/SKILL.md", import.meta.url));
fs.mkdirSync(fileURLToPath(new URL("../skills/lgtm/", import.meta.url)), { recursive: true });
fs.writeFileSync(out, skillMarkdown());
console.log(`wrote ${out}`);
