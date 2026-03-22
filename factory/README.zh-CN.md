# Meta_Kim Agent Foundry 中文说明

这个目录就是你后面要扩成多部门、上千 agent 的生产工厂。

它不是主元架构本体，而是 **批量生产行业 agent 的扩展层**。

可以把它简单理解成两层：

- 工厂层：先批量生成 `100` 个部门 agent 和 `1000` 个 specialist
- 旗舰层：再从里面挑出最关键的 `20` 个做手工强化

## 你最该先看的目录

- `generated/`
  这里是全量工厂产物。
- `runtime-packs/`
  这里是全量工厂产物对应的 Claude Code / Codex / OpenClaw 包。
- `flagship-complete/`
  这里是 20 个手工强化旗舰 agent 的统一总包。
- `catalog/`
  这里是生成规则和配置源。

## 目录作用

### `catalog/`

定义怎么生成行业 agent。

- `foundry-config.mjs`：20 个行业、5 个部门模板、specialist 模板的总配置
- `flagship-batch-*.mjs`：4 批旗舰 agent 的手工强化配置
- `flagship-complete.mjs`：把 20 个旗舰 agent 合成一个统一总包

### `generated/`

这里是全量工厂产物。

- `departments/`：100 个部门级 agent
- `specialists/`：1000 个 specialist
- `industry-coverage-matrix.md`：全行业覆盖总表
- `flagship-20.md`：20 个旗舰名单
- `organization-map.json`：组织结构映射
- `department-call-protocol.json`：部门调用协议

### `runtime-packs/`

这里是把全量工厂层产物编译成三端运行时包后的结果。

- `claude/agents/`
- `codex/agents/`
- `openclaw/workspaces/`

这一层是全量 `1100` 个 agent 的运行时投影。

### `flagship-batch-1/` 到 `flagship-batch-4/`

这是分批打磨用的目录。

每个目录里有 `5` 个手工强化旗舰 agent。

### `flagship-complete/`

这是你现在最值得直接看的目录。

它把 `20` 个手工强化旗舰 agent 全部放在一个地方，并且附带三端运行时包。

如果你不想在 4 个 batch 之间来回找，直接看这里。

## 现在到底已经做完了什么

目前工厂层已经有：

- `20` 个行业
- `5` 个部门模板
- `100` 个部门级 agent
- `1000` 个 specialist
- `20` 个手工强化旗舰 agent
- 三端运行时包

## 常用命令

### `npm run build:agent-foundry`

重建整个工厂层：

- 100 个部门 agent
- 1000 个 specialist
- 全量运行时包
- 20 个旗舰

### `npm run build:flagships`

只重建 20 个旗舰层。

### `npm run build:flagship-complete`

只重建统一的 20 旗舰总包。

### `npm run check:agent-foundry`

检查工厂层和运行时包有没有漂移。

## 你现在最推荐的阅读顺序

1. `generated/industry-coverage-matrix.md`
2. `generated/flagship-20.md`
3. `flagship-complete/README.zh-CN.md`
4. `flagship-complete/agents/`
