# Meta_Kim Foundry 运行时包

这是工厂层生成后的三端运行时总包。

- **100 个部门级运行时 agent**
- **1000 个 specialist 运行时 agent**
- **1100 个运行时 agent 总数**

它会把工厂层内容编译成：

- Claude Code
- Codex
- OpenClaw

## 目录结构

```text
factory/runtime-packs/
├─ README.md
├─ README.zh-CN.md
├─ summary.json
├─ claude/agents/*.md
├─ codex/agents/*.toml
└─ openclaw/
   ├─ openclaw.template.json
   └─ workspaces/<agent-id>/
      ├─ SOUL.md
      ├─ AGENTS.md
      ├─ TOOLS.md
      ├─ BOOTSTRAP.md
      └─ MEMORY.md
```

## 数量

- 部门包：100
- Specialist 包：1000
- 总包：1100

## 源头文件

真正的主源仍然是：

- `factory/catalog/foundry-config.mjs`
- `factory/generated/*.json`
- `factory/generated/departments/**`
- `factory/generated/specialists/**`

这里的运行时包只是生成后的投影文件，不建议手工逐个维护。
