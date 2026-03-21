# Meta_Kim

> A cross-runtime Meta architecture pack built from `meta/meta.md`.

Meta_Kim is not an application. It is a portable agent-architecture repository that turns the theory of `元 = 最小可治理单元` into runtime-ready assets for Claude Code, OpenClaw, and Codex.

## What This Repository Ships

- Claude Code runtime pack:
  - `CLAUDE.md`
  - `.claude/agents/*.md`
  - `.claude/skills/meta-theory/SKILL.md`
  - `.claude/settings.json`
  - `.mcp.json`
- OpenClaw runtime pack:
  - `openclaw/workspaces/*`
  - `openclaw/skills/meta-theory.md`
  - `openclaw/openclaw.template.json`
- Codex runtime pack:
  - `AGENTS.md`
  - `codex/config.toml.example`
- Shared infrastructure:
  - `scripts/sync-runtimes.mjs`
  - `scripts/validate-project.mjs`
  - `scripts/mcp/meta-runtime-server.mjs`
  - `meta/runtime-capability-matrix.md`

## Canonical Sources

- `meta/meta.md`: canonical theory source and vocabulary
- `.claude/agents/*.md`: canonical agent-definition source
- `.claude/skills/meta-theory/SKILL.md`: canonical skill-definition source

Everything else in the repository is either derived from those files or runtime-specific glue.

## Runtime Capability Matrix

| Capability | Claude Code | OpenClaw | Codex |
| --- | --- | --- | --- |
| Subagents / multi-agent | Native `.claude/agents/` | Native isolated workspaces | Repo-guided delegation surface |
| Skills | Native `.claude/skills/` | Native installable Markdown skill | Shared skill reference via repo docs |
| MCP | Native `.mcp.json` | No stable native MCP contract documented in the main runtime docs | Native user-level MCP config |
| Hooks / guardrails | Native `.claude/settings.json` hooks | Heartbeat and gateway/security config are the nearest equivalent | No repo-native hook file surface |
| Memory | `CLAUDE.md` and files | Workspace memory files | Repo instructions plus host-managed context |

Full details live in `meta/runtime-capability-matrix.md`.

## Quick Start

### Claude Code

1. Open this repository in Claude Code.
2. The 8 project subagents load from `.claude/agents/`.
3. The portable Meta_Kim skill loads from `.claude/skills/meta-theory/SKILL.md`.
4. Project hooks load from `.claude/settings.json`.
5. The local Meta_Kim MCP server is defined in `.mcp.json`.
6. Optional: install extra community skills with `bash install-deps.sh`.

### Codex

1. Open the repository in Codex or Codex CLI.
2. Root `AGENTS.md` is the repository instruction entry point.
3. Optional: wire the local MCP server by copying `codex/config.toml.example` into `~/.codex/config.toml` and replacing `REPLACE_WITH_REPO_ROOT`.
4. The portable skill reference is available at `shared-skills/meta-theory.md`.

### OpenClaw

1. Install dependencies and generate runtime artifacts:

   ```bash
   npm install
   npm run sync:runtimes
   ```

2. Merge `openclaw/openclaw.template.json` or the machine-local `openclaw/openclaw.local.json` into your OpenClaw agent configuration.
3. Install the portable skill:

   ```bash
   openclaw skill install ./openclaw/skills/meta-theory.md
   ```

4. Point your OpenClaw agent workspaces at `openclaw/workspaces/<agent-id>/`.
5. Smoke test one agent:

   ```bash
   openclaw agent --local --agent meta-warden -m "Read your SOUL.md first, then introduce the team."
   ```

## Commands

- `npm run sync:runtimes`: regenerate OpenClaw workspaces, shared skill copies, and local OpenClaw config output
- `npm run test:mcp`: smoke test the local MCP server
- `npm run validate`: validate canonical sources, generated assets, hooks, and MCP wiring
- `npm run check`: confirm generated assets are current and validation passes

## Project Structure

```text
Meta_Kim/
├── AGENTS.md
├── CLAUDE.md
├── .claude/
│   ├── agents/
│   ├── hooks/
│   ├── settings.json
│   └── skills/meta-theory/
├── .mcp.json
├── codex/config.toml.example
├── meta/
│   ├── meta.md
│   └── runtime-capability-matrix.md
├── openclaw/
│   ├── openclaw.template.json
│   ├── skills/
│   └── workspaces/
├── scripts/
│   ├── mcp/meta-runtime-server.mjs
│   ├── sync-runtimes.mjs
│   └── validate-project.mjs
└── shared-skills/
```

## Notes

- This repository was aligned to the documented runtime surfaces for Claude Code, OpenClaw, and Codex as checked on 2026-03-21.
- OpenClaw docs currently expose both newer `config.yml` references and multi-agent `openclaw.json` examples. Meta_Kim ships the portable identity/workspace layer plus a JSON template because that part is stable across deployments.
- Generated assets should not be your first edit target. Change the canonical Claude sources first, then regenerate.

## License

MIT
