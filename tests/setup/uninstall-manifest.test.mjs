import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

import {
  manifestEntryToFinding,
  findingsFromManifest,
} from "../../scripts/uninstall.mjs";
import {
  createEmpty,
  record,
  writeManifest,
  manifestPathFor,
  CATEGORIES,
} from "../../scripts/install-manifest.mjs";

function withTmpRepo(body) {
  const dir = mkdtempSync(path.join(tmpdir(), "meta-kim-uninstall-"));
  mkdirSync(path.join(dir, ".meta-kim"), { recursive: true });
  try {
    return body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("uninstall / manifestEntryToFinding", () => {
  test("maps a file entry to a file finding", () => {
    const finding = manifestEntryToFinding({
      path: "/repo/.claude/settings.json",
      category: CATEGORIES.G,
      source: "sync-runtimes",
      purpose: "project-settings",
      kind: "file",
      size: 512,
    });
    assert.equal(finding.kind, "file");
    assert.equal(finding.path, "/repo/.claude/settings.json");
    assert.equal(finding.category, CATEGORIES.G);
    assert.equal(finding.source, "sync-runtimes");
    assert.equal(finding.purpose, "project-settings");
    assert.equal(finding.size, 512);
  });

  test("maps a dir entry to a dir finding", () => {
    const finding = manifestEntryToFinding({
      path: "/home/kim/.claude/skills/meta-theory",
      category: CATEGORIES.A,
      kind: "dir",
    });
    assert.equal(finding.kind, "dir");
  });

  test("maps settings-merge entry with mergedHookCommands", () => {
    const finding = manifestEntryToFinding({
      path: "/home/kim/.claude/settings.json",
      category: CATEGORIES.C,
      kind: "settings-merge",
      mergedHookCommands: ["node a.mjs", "node b.mjs", "node c.mjs"],
    });
    assert.equal(finding.kind, "settings-merge");
    assert.equal(finding.managedHookCount, 3);
    assert.equal(finding.managedHooks.length, 3);
    assert.equal(finding.managedHooks[0].command, "node a.mjs");
    assert.equal(finding.managedHooks[0].event, null);
    assert.equal(finding.managedHooks[0].matcher, null);
  });

  test("settings-merge without mergedHookCommands defaults to empty array", () => {
    const finding = manifestEntryToFinding({
      path: "/x/settings.json",
      category: CATEGORIES.C,
      kind: "settings-merge",
    });
    assert.equal(finding.managedHookCount, 0);
    assert.deepEqual(finding.managedHooks, []);
  });

  test("returns null for pip-package entries", () => {
    const finding = manifestEntryToFinding({
      path: "pip:graphifyy",
      category: CATEGORIES.I,
      kind: "pip-package",
      pipPackageName: "graphifyy",
    });
    assert.equal(finding, null);
  });

  test("returns null for mcp-server entries", () => {
    const finding = manifestEntryToFinding({
      path: "/x/.mcp.json",
      category: CATEGORIES.G,
      kind: "mcp-server",
      mcpServerName: "meta_kim_runtime",
    });
    assert.equal(finding, null);
  });

  test("returns null for git-hook entries", () => {
    const finding = manifestEntryToFinding({
      path: "/repo/.git/hooks/post-commit",
      category: CATEGORIES.I,
      kind: "git-hook",
    });
    assert.equal(finding, null);
  });

  test("returns null when path or category is missing", () => {
    assert.equal(manifestEntryToFinding(null), null);
    assert.equal(manifestEntryToFinding(undefined), null);
    assert.equal(manifestEntryToFinding({}), null);
    assert.equal(manifestEntryToFinding({ path: "/x" }), null);
    assert.equal(manifestEntryToFinding({ category: CATEGORIES.A }), null);
  });

  test("preserves source when entry.source is missing", () => {
    const finding = manifestEntryToFinding({
      path: "/x/y.md",
      category: CATEGORIES.D,
      kind: "file",
    });
    assert.equal(finding.source, "manifest");
  });
});

describe("uninstall / findingsFromManifest", () => {
  test("returns empty array when no manifest exists", () => {
    withTmpRepo((repo) => {
      const findings = findingsFromManifest({
        scope: "project",
        repoRoot: repo,
      });
      assert.deepEqual(findings, []);
    });
  });

  test("reads project manifest entries when scope includes project", () => {
    withTmpRepo((repo) => {
      let m = createEmpty({
        scope: "project",
        repoRoot: repo,
        metaKimVersion: "2.0.13",
      });
      m = record(m, {
        path: path.join(repo, ".claude/agents/meta-warden.md"),
        category: CATEGORIES.F,
        source: "sync-runtimes",
        purpose: "project-agent",
        kind: "file",
      });
      m = record(m, {
        path: path.join(repo, ".claude/hooks/post-format.mjs"),
        category: CATEGORIES.E,
        source: "sync-runtimes",
        purpose: "project-hook",
        kind: "file",
      });
      writeManifest(manifestPathFor("project", repo), m);

      const findings = findingsFromManifest({
        scope: "project",
        repoRoot: repo,
      });
      assert.equal(findings.length, 2);
      assert.equal(findings[0].category, CATEGORIES.F);
      assert.equal(findings[1].category, CATEGORIES.E);
    });
  });

  test("filters out non-actionable entry kinds (pip/mcp/git-hook)", () => {
    withTmpRepo((repo) => {
      let m = createEmpty({
        scope: "project",
        repoRoot: repo,
        metaKimVersion: "2.0.13",
      });
      m = record(m, {
        path: path.join(repo, ".claude/agents/meta-warden.md"),
        category: CATEGORIES.F,
        purpose: "project-agent",
        kind: "file",
      });
      m = record(m, {
        path: "pip:graphifyy",
        category: CATEGORIES.I,
        purpose: "pip-package:graphifyy",
        kind: "pip-package",
      });
      m = record(m, {
        path: path.join(repo, ".git/hooks/post-commit"),
        category: CATEGORIES.I,
        purpose: "graphify-git-hook",
        kind: "git-hook",
      });
      writeManifest(manifestPathFor("project", repo), m);

      const findings = findingsFromManifest({
        scope: "project",
        repoRoot: repo,
      });
      assert.equal(findings.length, 1);
      assert.equal(findings[0].category, CATEGORIES.F);
    });
  });

  test("returns empty array when scope is global and no global manifest", () => {
    withTmpRepo((repo) => {
      let m = createEmpty({
        scope: "project",
        repoRoot: repo,
        metaKimVersion: "2.0.13",
      });
      m = record(m, {
        path: path.join(repo, ".claude/agents/meta-warden.md"),
        category: CATEGORIES.F,
        kind: "file",
      });
      writeManifest(manifestPathFor("project", repo), m);

      const findings = findingsFromManifest({
        scope: "project",
        repoRoot: repo,
      });
      assert.equal(findings.length, 1);
    });
  });

  test("corrupt / unreadable manifest returns empty array, never throws", () => {
    withTmpRepo((repo) => {
      writeFileSync(manifestPathFor("project", repo), "not-json");
      const findings = findingsFromManifest({
        scope: "project",
        repoRoot: repo,
      });
      assert.deepEqual(findings, []);
    });
  });
});
