# Meta_Kim 20 个旗舰总包

这个目录放的是 20 个经过手工强化的旗舰 agent。

如果你只想看最强的 20 个成品层，不想在 4 个 batch 之间来回切，直接看这里就行。

## 你在这里能看到什么

- 旗舰 agent 源文件
- Claude Code 运行时包
- Codex 运行时包
- OpenClaw workspace 包
- 机器可读索引：`index.json`
- 机器可读总览：`summary.json`

## 收录列表

| 行业 | 部门 | 运行时 ID | 来源部门 seed |
| --- | --- | --- | --- |
| 游戏 | 战略办公室 | `flagship-game-strategy-office` | `game-strategy-office` |
| 互联网产品 | 增长运营 | `flagship-internet-growth-operations` | `internet-growth-operations` |
| 金融 | 战略办公室 | `flagship-finance-strategy-office` | `finance-strategy-office` |
| AI | 产品交付 | `flagship-ai-product-delivery` | `ai-product-delivery` |
| 医疗 | 风险合规 | `flagship-healthcare-risk-compliance` | `healthcare-risk-compliance` |
| 股票 | 研究情报 | `flagship-stocks-research-intelligence` | `stocks-research-intelligence` |
| 投资 | 研究情报 | `flagship-investment-research-intelligence` | `investment-research-intelligence` |
| Web3 | 风险合规 | `flagship-web3-risk-compliance` | `web3-risk-compliance` |
| 自媒体 | 增长运营 | `flagship-media-growth-operations` | `media-growth-operations` |
| 电商 | 增长运营 | `flagship-ecommerce-growth-operations` | `ecommerce-growth-operations` |
| 教育 | 产品交付 | `flagship-education-product-delivery` | `education-product-delivery` |
| 法律 | 风险合规 | `flagship-legal-risk-compliance` | `legal-risk-compliance` |
| 制造 | 产品交付 | `flagship-manufacturing-product-delivery` | `manufacturing-product-delivery` |
| 物流 | 增长运营 | `flagship-logistics-growth-operations` | `logistics-growth-operations` |
| 房地产 | 战略办公室 | `flagship-real-estate-strategy-office` | `real-estate-strategy-office` |
| 能源 | 战略办公室 | `flagship-energy-strategy-office` | `energy-strategy-office` |
| 汽车 | 产品交付 | `flagship-automotive-product-delivery` | `automotive-product-delivery` |
| 旅游与酒店 | 增长运营 | `flagship-travel-growth-operations` | `travel-growth-operations` |
| 生物科技 | 研究情报 | `flagship-biotech-research-intelligence` | `biotech-research-intelligence` |
| 公共部门 | 战略办公室 | `flagship-public-sector-strategy-office` | `public-sector-strategy-office` |

## 目录结构

```text
factory/flagship-complete/
├─ README.md
├─ README.zh-CN.md
├─ summary.json
├─ index.json
├─ agents/*.md
└─ runtime-packs/
   ├─ claude/agents/*.md
   ├─ codex/agents/*.toml
   └─ openclaw/
      ├─ openclaw.template.json
      └─ workspaces/<agent-id>/*
```
