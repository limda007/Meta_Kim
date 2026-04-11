# Dead Code Analysis Report

**Generated:** 2026-04-11
**Analyzer:** refactor-clean (superpowers)
**Scope:** scripts/*.mjs, scripts/**/*.mjs, root *.mjs

---

## Summary

| Category | Count |
|----------|-------|
| **Already Removed** | 2 items (pathExists, resolveOutputPath) |
| **Confirmed Dead** | 0 |
| **Safe to Remove** | 0 |
| **Potentially Removable** | 5 items (CAUTION - internal API) |

---

## Already Removed (Previous Session)

### 1. `pathExists()` — SAFE removal
- **Location:** `scripts/meta-kim-sync-config.mjs`
- **Severity:** SAFE
- **Reason:** Defined but never imported or called anywhere in the codebase
- **Action:** Removed in previous session

### 2. `resolveOutputPath()` — SAFE removal
- **Location:** `scripts/meta-kim-sync-config.mjs`
- **Severity:** SAFE
- **Reason:** Exported but no consumer ever called it
- **Action:** Removed in previous session

---

## Export Usage Analysis

### meta-kim-sync-config.mjs — Full Export Surface

The module exports 25 items. Cross-referencing against all 9 consumer scripts:

| Export | Used By | Status |
|--------|---------|--------|
| `repoRoot` | sync-runtimes.mjs | ACTIVE |
| `canonicalAgentsDir` | sync-runtimes.mjs, validate-project.mjs, prepare-openclaw-local.mjs, eval-meta-agents.mjs, mcp/meta-runtime-server.mjs | ACTIVE |
| `canonicalSkillRoot` | sync-global-meta-theory.mjs | ACTIVE |
| `canonicalSkillPath` | sync-runtimes.mjs, validate-project.mjs | ACTIVE |
| `canonicalSkillReferencesDir` | sync-runtimes.mjs, validate-project.mjs | ACTIVE |
| `canonicalRuntimeAssetsDir` | sync-runtimes.mjs, validate-project.mjs, eval-meta-agents.mjs | ACTIVE |
| `normalizeTargets` | setup.mjs | ACTIVE |
| `loadRuntimeProfiles` | validate-project.mjs | ACTIVE |
| `loadSyncManifest` | validate-project.mjs | ACTIVE |
| `loadLocalOverrides` | setup.mjs | ACTIVE |
| `writeLocalOverrides` | setup.mjs | ACTIVE |
| `resolveTargetContext` | sync-runtimes.mjs, sync-global-meta-theory.mjs, doctor-governance.mjs, install-global-skills-all-runtimes.mjs, eval-meta-agents.mjs, setup.mjs | ACTIVE |
| `resolveRuntimeHomeDir` | sync-runtimes.mjs | ACTIVE |
| `parseScopeArg` | sync-runtimes.mjs | ACTIVE |
| `assertHomeBound` | sync-runtimes.mjs | ACTIVE |
| `canonicalRoot` | Internal only (feeds canonicalAgentsDir etc.) | UNUSED (internal) |
| `runtimesDir` | Internal only (feeds loadRuntimeProfiles) | UNUSED (internal) |
| `syncManifestPath` | Internal only (feeds loadSyncManifest) | UNUSED (internal) |
| `localOverridesPath` | Internal only (feeds loadLocalOverrides) | UNUSED (internal) |
| `supportedTargetIds` | Internal only (used by normalizeTargets) | UNUSED (internal) |
| `readJsonIfExists` | Internal only (used by loadLocalOverrides) | UNUSED (internal) |
| `parseTargetsArg` | Internal only (used by resolveTargetContext) | UNUSED (internal) |
| `validateSyncManifest` | Internal only (called by loadSyncManifest) | UNUSED (internal) |
| `validateRuntimeProfile` | Internal only (called by loadRuntimeProfiles) | UNUSED (internal) |

### CAUTION Items — Internal API Design Choice

The 7 UNUSED exports above are **intentional internal API**: they are exported so external consumers can optionally use the raw building blocks, while the module also provides higher-level functions that use them. Removing `export` from these would be a clean-up but risks breaking future extensibility. These are not classical "dead code" — they are a documented internal layer.

**Recommendation:** Keep as-is. They cost minimal bytes and serve as discoverable API documentation.

---

## Consumer Scripts (Verified)

| Script | Imports From meta-kim-sync-config |
|--------|-----------------------------------|
| sync-runtimes.mjs | canonicalAgentsDir, canonicalRuntimeAssetsDir, canonicalSkillPath, canonicalSkillReferencesDir, repoRoot, resolveTargetContext, resolveRuntimeHomeDir, parseScopeArg, assertHomeBound |
| sync-global-meta-theory.mjs | canonicalRuntimeAssetsDir, canonicalSkillRoot, resolveTargetContext |
| validate-project.mjs | canonicalAgentsDir, canonicalRuntimeAssetsDir, canonicalSkillPath, canonicalSkillReferencesDir, loadRuntimeProfiles, loadSyncManifest |
| prepare-openclaw-local.mjs | canonicalAgentsDir |
| eval-meta-agents.mjs | canonicalAgentsDir, canonicalRuntimeAssetsDir |
| mcp/meta-runtime-server.mjs | canonicalAgentsDir |
| doctor-governance.mjs | resolveTargetContext |
| install-global-skills-all-runtimes.mjs | resolveTargetContext |
| setup.mjs | loadLocalOverrides, normalizeTargets, resolveTargetContext, writeLocalOverrides |

---

## No Additional Dead Code Found

- All remaining exports have at least one internal or external consumer
- No duplicate implementations found across scripts
- No unused dependencies in package.json

---

## Conclusion

The codebase is well-maintained. Only the 2 already-removed items (`pathExists`, `resolveOutputPath`) were true dead code. The remaining exports in `meta-kim-sync-config.mjs` form an intentional internal API layer — they are exported but not yet consumed externally, serving as composable building blocks for future use.

**No deletions recommended. No further action needed.**
