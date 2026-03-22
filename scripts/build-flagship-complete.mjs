import { flagshipComplete } from "../factory/catalog/flagship-complete.mjs";
import { buildFlagshipBatch } from "./lib/build-flagship-batch.mjs";

await buildFlagshipBatch({
  batchName: "Meta_Kim Flagship Complete",
  outDirName: "flagship-complete",
  description:
    "This directory is the single unified bundle for all 20 hand-polished Meta_Kim flagship agents.",
  intro: [
    "Use this directory when you want the full polished flagship layer in one place instead of browsing the four batch folders separately.",
    "The four batch directories still exist for staged editing, but `flagship-complete/` is the easiest place to inspect, import, and package all 20 flagship agents together.",
    "Each flagship remains tied to the same base department seed while carrying sharper ownership, refusal, tool, and handoff rules.",
  ],
  profileBadge: "Full 20-agent unified flagship refinement",
  includeZhReadme: true,
  includeSummary: true,
  profiles: flagshipComplete,
});
