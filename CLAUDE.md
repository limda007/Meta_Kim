# Meta_Kim for Claude Code

Meta_Kim uses Claude Code as the canonical authoring runtime, but the repository is built to port cleanly into OpenClaw and Codex.

## Canonical Files

- Theory source: `meta/meta.md`
- Claude project memory: `CLAUDE.md`
- Claude subagents: `.claude/agents/*.md`
- Claude skill source: `.claude/skills/meta-theory/SKILL.md`
- Claude hooks: `.claude/settings.json` and `.claude/hooks/*`
- Claude project MCP config: `.mcp.json`
- Shared MCP server: `scripts/mcp/meta-runtime-server.mjs`
- Cross-runtime contract: `AGENTS.md`
- Capability matrix: `meta/runtime-capability-matrix.md`

## Hard Rules

- Every file in `.claude/agents/` must keep valid YAML frontmatter with at least `name` and `description`.
- `.claude/agents/*.md` and `.claude/skills/meta-theory/SKILL.md` are the only canonical authoring sources.
- `openclaw/workspaces/*`, `openclaw/skills/*`, and `shared-skills/*` are derived assets. Regenerate them instead of hand-maintaining them.
- After changing any canonical prompt or skill source, always run:
  - `npm run sync:runtimes`
  - `npm run validate`
- `meta/meta.md` is intentionally long. Reference it when needed; do not blindly duplicate the whole transcript into runtime prompts.

## Claude Capability Surfaces

| Surface | Path | Purpose |
| --- | --- | --- |
| Project memory | `CLAUDE.md` | Repository-level instructions for Claude Code |
| Subagents | `.claude/agents/*.md` | 8 native Claude Code project subagents |
| Skill | `.claude/skills/meta-theory/SKILL.md` | Reusable Meta_Kim workflow |
| Hooks | `.claude/settings.json` + `.claude/hooks/*` | Safety and subagent context injection |
| MCP | `.mcp.json` | Project-scoped MCP server definition |

## Available Meta Agents

| Agent | Purpose |
| --- | --- |
| `meta-warden` | Coordination, quality gates, synthesis, meta-review |
| `meta-genesis` | SOUL.md and core prompt architecture |
| `meta-artisan` | Skill, tool, and capability matching |
| `meta-sentinel` | Security boundaries, hooks, rollback rules |
| `meta-librarian` | Memory, continuity, knowledge persistence |
| `meta-conductor` | Workflow orchestration and rhythm control |
| `meta-prism` | Quality forensics and drift detection |
| `meta-scout` | External capability discovery and adoption |

## Working Loop

1. Edit the canonical source prompt or skill.
2. Run `npm run sync:runtimes`.
3. Run `npm run validate`.
4. If the runtime contract changed, update `README.md` and `AGENTS.md`.

## Optional External Skill Pack

`install-deps.sh` installs optional Claude-oriented community skills into `~/.claude/skills/`.

```bash
bash install-deps.sh
```

Those dependencies are accelerators, not the canonical Meta_Kim source.
