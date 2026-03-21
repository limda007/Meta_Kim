# Meta_Kim Runtime Capability Matrix

This repository targets three different agent runtimes. They overlap, but they are not identical.

## Capability Mapping

| Capability | Claude Code | OpenClaw | Codex | Meta_Kim implementation |
| --- | --- | --- | --- | --- |
| Theory source | `CLAUDE.md` can reference repo docs | workspace prompts can reference repo docs | `AGENTS.md` can reference repo docs | `meta/meta.md` is the canonical long-form source |
| Subagents / multi-agent | Native project subagents in `.claude/agents/` | Native multi-agent via isolated workspaces and `agents.list` | Repo-guided agent workflows and built-in delegation surfaces | `.claude/agents/*.md` is the canonical source; `openclaw/workspaces/*` is generated |
| Skills | Native project skills in `.claude/skills/` | Native Markdown+YAML skills, installable with `openclaw skill install` | No repo-native skill loader; best handled as referenced shared instructions | `.claude/skills/meta-theory/SKILL.md` is canonical; `shared-skills/` and `openclaw/skills/` are derived |
| MCP | Native `.mcp.json` project config | No stable native MCP contract documented in the main runtime docs | Native user config in `~/.codex/config.toml` | Shared local MCP server at `scripts/mcp/meta-runtime-server.mjs` |
| Hooks / automation guards | Native `.claude/settings.json` hooks | Closest equivalents are heartbeat tasks and gateway execution/security config | No repo-native hook file documented | Claude gets real hooks; OpenClaw gets heartbeat/workspace assets; Codex uses AGENTS + validation commands |
| Memory | `CLAUDE.md`, files, and skill conventions | Workspace memory and heartbeat-driven continuity | Repo instructions plus host-managed context | Memory strategy remains documented in agent prompts and shared skill |

## What "Portable" Means In Meta_Kim

Portable does not mean pretending all runtimes have the same features.

Portable means:
- one canonical theory source
- one canonical agent-definition source
- explicit runtime adapters
- explicit statements where a runtime has no native equivalent

## Canonical Sources

- Theory: `meta/meta.md`
- Claude agents: `.claude/agents/*.md`
- Claude skill: `.claude/skills/meta-theory/SKILL.md`
- Shared skill copy: `shared-skills/meta-theory.md`
- OpenClaw runtime pack: `openclaw/`
- Codex repo entry: `AGENTS.md`

## Required Workflow

Whenever you change agent prompts or the shared skill:

1. Edit the canonical source file.
2. Run `npm run sync:runtimes`.
3. Run `npm run validate`.
4. Update `CLAUDE.md` and `README.md` if the runtime contract changed.
