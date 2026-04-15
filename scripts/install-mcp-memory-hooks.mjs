/**
 * install-mcp-memory-hooks.mjs
 *
 * Installs MCP Memory Service Claude Code hooks.
 * - Copies session-start Python hook to ~/.claude/hooks/
 * - Registers SessionStart hook in ~/.claude/settings.json
 * - Warns if MCP server not running on localhost:8888
 *
 * Usage: node scripts/install-mcp-memory-hooks.mjs
 *        node scripts/install-mcp-memory-hooks.mjs --check   # Dry-run: verify only
 *        node scripts/install-mcp-memory-hooks.mjs --remove  # Uninstall hooks
 */

import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// ── Config ──────────────────────────────────────────────

const MCP_HOOK_SOURCE = join(REPO_ROOT, ".mcp.json");
const MCP_MEMORY_HOOK_SOURCE = join(
  homedir(),
  ".claude",
  "hooks",
  "mcp_memory_global.py",
);
const MCP_MEMORY_HOOK_TARGET = join(
  homedir(),
  ".claude",
  "hooks",
  "mcp_memory_global.py",
);
const MCP_MEMORY_CONFIG_SOURCE = join(
  homedir(),
  ".claude",
  "hooks",
  "config.json",
);
const MCP_MEMORY_CONFIG_TARGET = join(
  homedir(),
  ".claude",
  "hooks",
  "config.json",
);
const CLAUDE_SETTINGS = join(homedir(), ".claude", "settings.json");

// ── Helpers ──────────────────────────────────────────────

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

function info(msg) {
  console.log(`  ${dim("→")} ${msg}`);
}
function ok(msg) {
  console.log(`  ${green("✓")} ${msg}`);
}
function warn(msg) {
  console.log(`  ${yellow("⚠")} ${msg}`);
}
function fail(msg) {
  console.log(`  ${red("✗")} ${msg}`);
}

function run(cmd, args, opts = {}) {
  return spawnSync(cmd, args, {
    encoding: "utf8",
    shell: false,
    ...opts,
  });
}

function checkServerHealth() {
  try {
    const result = run("curl", [
      "-s",
      "--max-time",
      "2",
      "http://localhost:8888/api/health",
    ]);
    if (result.status === 0) {
      const data = JSON.parse(result.stdout || "{}");
      return data.status === "healthy";
    }
  } catch {
    // fall through
  }
  return false;
}

function ensureHooksDir() {
  const dir = join(homedir(), ".claude", "hooks");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    info(`Created ${dir}`);
  }
  return dir;
}

function ensureMcpMemoryConfig() {
  const source = join(REPO_ROOT, ".mcp.json");
  const target = join(homedir(), ".claude", "hooks", "config.json");
  const targetDir = join(homedir(), ".claude", "hooks");

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  if (!existsSync(target)) {
    if (existsSync(source)) {
      try {
        const mcpConfig = JSON.parse(readFileSync(source, "utf8"));
        // Extract just the mcp-memory-service server from .mcp.json
        const memoryConfig = {
          memoryService: mcpConfig.mcpServers?.["mcp-memory-service"] ?? {
            command: "python",
            args: ["-m", "mcp_memory_service"],
          },
        };
        writeFileSync(target, JSON.stringify(memoryConfig, null, 2) + "\n");
        ok(`Created ${target}`);
        return true;
      } catch {
        warn(`Could not parse ${source}, using defaults`);
      }
    }
  }
  return existsSync(target);
}

function registerSessionStartHook(settingsPath) {
  if (!existsSync(settingsPath)) {
    warn(`${settingsPath} not found — skipping hook registration`);
    return false;
  }

  try {
    const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
    const hookCmd = "python";
    const hookArgs = [
      join(homedir(), ".claude", "hooks", "mcp_memory_global.py"),
    ];

    // Check if already registered
    const existingBlocks = settings.hooks?.SessionStart || [];
    const alreadyRegistered = existingBlocks.some(
      (b) =>
        b.matcher === "*" &&
        b.hooks?.some((h) => h.command?.includes("mcp_memory_global.py")),
    );

    if (alreadyRegistered) {
      ok("SessionStart hook already registered");
      return true;
    }

    // Add SessionStart block
    if (!settings.hooks) settings.hooks = {};
    if (!settings.hooks.SessionStart) {
      settings.hooks.SessionStart = [];
    }
    settings.hooks.SessionStart.push({
      matcher: "*",
      hooks: [
        {
          type: "command",
          command: `${hookCmd} "${hookArgs[0]}"`,
        },
      ],
    });

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
    ok("SessionStart hook registered in settings.json");
    return true;
  } catch (err) {
    warn(`Failed to register hook: ${err.message}`);
    return false;
  }
}

function removeSessionStartHook(settingsPath) {
  if (!existsSync(settingsPath)) return;
  try {
    const settings = JSON.parse(readFileSync(settingsPath, "utf8"));
    if (!settings.hooks?.SessionStart) return;

    settings.hooks.SessionStart = settings.hooks.SessionStart.map((block) => ({
      ...block,
      hooks: (block.hooks || []).filter(
        (h) => !h.command?.includes("mcp_memory_global.py"),
      ),
    })).filter((block) => (block.hooks || []).length > 0);

    if (settings.hooks.SessionStart.length === 0) {
      delete settings.hooks.SessionStart;
    }

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
    ok("SessionStart hook removed from settings.json");
  } catch (err) {
    warn(`Failed to remove hook: ${err.message}`);
  }
}

// ── Install ──────────────────────────────────────────────

function install() {
  console.log(`\n${bold("Installing MCP Memory Claude Code hooks...")}\n`);

  ensureHooksDir();
  ensureMcpMemoryConfig();

  // The session-start Python hook is the user's custom global hook
  // It should already be at the target path
  if (existsSync(MCP_MEMORY_HOOK_SOURCE)) {
    ok(`Python hook found: ${MCP_MEMORY_HOOK_SOURCE}`);
  } else {
    warn(`Python hook not found at ${MCP_MEMORY_HOOK_SOURCE}`);
    info("Create it from mcp-memory-service/claude-hooks/session-start.js");
    info(
      "or install mcp-memory-service hooks: cd <mcp-service>/claude-hooks && python install_hooks.py",
    );
  }

  const registered = registerSessionStartHook(CLAUDE_SETTINGS);
  if (!registered) {
    warn("Hook not registered — Claude Code may need restart or manual config");
  }

  // Check server health
  console.log("");
  info("Checking MCP Memory Service health...");
  const healthy = checkServerHealth();
  if (healthy) {
    ok("MCP Memory Service is running on localhost:8888");
  } else {
    warn("MCP Memory Service is NOT responding on localhost:8888");
    info("Start it with: npm start (in mcp-memory-service directory)");
    info("Or: python -m mcp_memory_service");
  }

  console.log(
    `\n${green("Done!")} Restart Claude Code for hooks to take effect.\n`,
  );
}

// ── Check (dry-run) ─────────────────────────────────────

function check() {
  console.log(`\n${bold("Checking MCP Memory hook installation...")}\n`);

  const hookExists = existsSync(MCP_MEMORY_HOOK_SOURCE);
  const configExists = existsSync(MCP_MEMORY_CONFIG_TARGET);
  const settingsExists = existsSync(CLAUDE_SETTINGS);

  hookExists ? ok("Python hook present") : warn("Python hook missing");
  configExists ? ok("Config present") : warn("Config missing");

  if (settingsExists) {
    try {
      const settings = JSON.parse(readFileSync(CLAUDE_SETTINGS, "utf8"));
      const ssBlocks = settings.hooks?.SessionStart || [];
      const registered = ssBlocks.some((b) =>
        b.hooks?.some((h) => h.command?.includes("mcp_memory_global")),
      );
      registered
        ? ok("SessionStart hook registered")
        : warn("SessionStart hook NOT registered");
    } catch {
      warn("Could not parse settings.json");
    }
  } else {
    warn("settings.json not found");
  }

  const healthy = checkServerHealth();
  healthy ? ok("Server responding") : warn("Server NOT responding");
}

// ── Remove ──────────────────────────────────────────────

function remove() {
  console.log(`\n${bold("Removing MCP Memory Claude Code hooks...")}\n`);

  removeSessionStartHook(CLAUDE_SETTINGS);
  warn(
    "Python hook file NOT removed (manual: rm ~/.claude/hooks/mcp_memory_global.py)",
  );
  warn("Config NOT removed (manual: rm ~/.claude/hooks/config.json)");
  ok("Done.");
}

// ── Main ──────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--check")) {
  check();
} else if (args.includes("--remove")) {
  remove();
} else {
  install();
}
