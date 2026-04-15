# planning-with-files - Dependency Research

## Repository

- **Owner**: OthmanAdi
- **Repo**: https://github.com/OthmanAdi/planning-with-files
- **Install ID**: `planning-with-files`

## Content

Manus-style persistent Markdown planning system. Provides a structured approach to project planning using markdown files that persist across sessions. Implements plan-creation, plan-tracking, and plan-completion workflows.

## Format

- **Standard**: SKILL.md (AgentSkills open standard)
- **Structure**: Content lives in `skills/planning-with-files/` subdirectory
- **Subdir**: `skills/planning-with-files`

## Cross-Platform Compatibility

| Platform | Compatible | Notes |
|----------|-----------|-------|
| Claude Code | Y | Primary target |
| Codex | Y | Listed in 16+ platforms |
| OpenClaw | Y | Listed in 16+ platforms |
| Cursor | Y | Listed in 16+ platforms |

README claims support for 16+ agent platforms.

## Distribution Configuration

```json
{
  "id": "planning-with-files",
  "repo": "OthmanAdi/planning-with-files",
  "subdir": "skills/planning-with-files",
  "pluginHookCompat": true,
  "targets": ["claude", "codex", "openclaw", "cursor"]
}
```

## Install Method

- **All platforms**: Sparse checkout from `skills/planning-with-files/` subdir
- Uses `installGitSkillFromSubdir()` with nested subdir path
- Clone + sparse-checkout + copy to target directory

## Special Notes

- Has hooks for lifecycle management (plan creation, tracking, completion)
- Hooks are Claude Code-specific but don't prevent other platforms from using the core SKILL.md
- Nested subdir path (`skills/planning-with-files`) is the deepest subdir among all dependencies
- Broadest platform support claim (16+ agents)

### Meta_Kim install layout

Upstream **Stop** hook uses `${CLAUDE_PLUGIN_ROOT:-$HOME/.claude/plugins/planning-with-files}/scripts`. Meta_Kim sets **`pluginHookCompat: true`** in `config/skills.json`: the canonical tree is deployed to **`skills/planning-with-files/`** under each runtime home (same as other skills), then **`plugins/planning-with-files` → `skills/planning-with-files`** (symlink on Unix, junction on Windows) so the default hook path resolves without rewriting `SKILL.md`.

## Data Source

- GitHub README: full content analysis
- OthmanAdi/planning-with-files repository
- `config/skills.json` manifest analysis

Research date: 2026-04-13
