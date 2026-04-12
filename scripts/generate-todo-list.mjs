#!/usr/bin/env node
/**
 * Generate docs/todo-list.md from todos.json
 * Usage: node scripts/generate-todo-list.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const todosPath = path.join(repoRoot, "todos.json");
const outputPath = path.join(repoRoot, "docs", "todo-list.md");

const data = JSON.parse(readFileSync(todosPath, "utf8"));
const done = data.todos.filter((t) => t.status === "done");
const open = data.todos.filter((t) => t.status === "open");

let md = `# Meta_Kim Todo List

> Source: \`todos.json\` · Generated: ${data.meta.generated}

## Summary

| Status | Count |
|--------|-------|
| ✅ Done | ${done.length} |
| 🔄 In Progress | ${data.todos.filter((t) => t.status === "in_progress").length} |
| ⬜ Open | ${open.length} |
| **Total** | **${data.todos.length}** |

## Done

| # | Title | Owner | Commit |
|---|-------|-------|--------|
`;

for (const t of done) {
  const commitLink = t.commit
    ? `[\`${t.commit}\`](https://github.com/KimYx0207/Meta_Kim/commit/${t.commit})`
    : "—";
  md += `| ${t.id} | ${t.title} | ${t.owner} | ${commitLink} |\n`;
}

md += `\n## Open\n\n`;

for (const t of open) {
  const priority =
    t.priority === "high"
      ? "🔴 High"
      : t.priority === "medium"
        ? "🟡 Medium"
        : "🟢 Low";
  md += `### ${t.id} — ${t.title}\n`;
  md += `- **Owner:** ${t.owner}\n`;
  md += `- **Priority:** ${priority}\n`;
  md += `- **Description:** ${t.description || "—"}\n`;
  if (t.checkpoints) {
    md += `- **Checkpoints:**\n`;
    for (const ck of t.checkpoints) {
      md += `  - [ ] ${ck}\n`;
    }
  }
  md += "\n";
}

writeFileSync(outputPath, md, "utf8");
console.log(`✅ Written: ${outputPath}`);
