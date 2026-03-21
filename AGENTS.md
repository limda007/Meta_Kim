# Meta_Kim Repository Guide

Meta_Kim is a cross-runtime agent-architecture repository built around the theory in `meta/meta.md`.

## Canonical Sources

- `meta/meta.md`: canonical theory source
- `.claude/agents/*.md`: canonical Meta_Kim agent definitions
- `.claude/skills/meta-theory/SKILL.md`: canonical portable skill definition

Everything else is either generated from those files or runtime-specific glue.

## Runtime Entry Points

| Runtime | Entry points |
| --- | --- |
| Claude Code | `CLAUDE.md`, `.claude/agents/`, `.claude/skills/`, `.claude/settings.json`, `.mcp.json` |
| OpenClaw | `openclaw/workspaces/*`, `openclaw/skills/meta-theory.md`, `openclaw/openclaw.template.json` |
| Codex | `AGENTS.md`, `codex/config.toml.example`, `shared-skills/meta-theory.md` |

## Required Workflow

- Edit `.claude/agents/*.md` or `.claude/skills/meta-theory/SKILL.md` first.
- Regenerate portable assets with `npm run sync:runtimes`.
- Validate the repository with `npm run validate`.
- If the runtime contract changed, update `CLAUDE.md` and `README.md`.

## Portable Capability Model

- Subagents: native in Claude Code, mapped to isolated workspaces in OpenClaw, and documented for Codex.
- Skills: native in Claude Code, ported to `openclaw/skills/`, and mirrored into `shared-skills/` for Codex-style repo usage.
- MCP: shared local server at `scripts/mcp/meta-runtime-server.mjs`, wired by `.mcp.json` and `codex/config.toml.example`.
- Hooks: native Claude hooks live in `.claude/settings.json`; other runtimes use their nearest equivalents rather than a fake 1:1 abstraction.

## Commands

- `npm run sync:runtimes`
- `npm run test:mcp`
- `npm run validate`
- `npm run check`

## Operating Principle

Meta_Kim is portable because it keeps:
- one theory source
- one agent-definition source
- one skill-definition source
- explicit runtime adapters

It does not pretend all runtimes have identical features.
