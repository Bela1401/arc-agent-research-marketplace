import { buildExplorerUrl, pricingModel } from "@/lib/arc";
import type {
  AgentProfile,
  DashboardSnapshot,
  EconomicsSummary,
  MicroTask,
  ResearchProject,
  TxLog
} from "@/lib/types";

const baseAgents: AgentProfile[] = [
  {
    id: "agent-manager",
    name: "Atlas Manager",
    role: "manager",
    specialty: "Task decomposition and flow orchestration",
    reputationScore: 97,
    walletAddress: "0x9e51...A102",
    identityId: "erc8004:atlas-manager",
    pricePerTaskUsd: 0.002
  },
  {
    id: "agent-research",
    name: "Signal Scout",
    role: "researcher",
    specialty: "Competitive research and source discovery",
    reputationScore: 95,
    walletAddress: "0x5A11...D520",
    identityId: "erc8004:signal-scout",
    pricePerTaskUsd: pricingModel.research
  },
  {
    id: "agent-fact-check",
    name: "Proof Engine",
    role: "fact_checker",
    specialty: "Source verification and claim validation",
    reputationScore: 93,
    walletAddress: "0xC12E...9B7C",
    identityId: "erc8004:proof-engine",
    pricePerTaskUsd: pricingModel.factCheck
  },
  {
    id: "agent-summary",
    name: "Brief Forge",
    role: "summarizer",
    specialty: "Executive summaries and synthesis",
    reputationScore: 91,
    walletAddress: "0x77F4...1AE3",
    identityId: "erc8004:brief-forge",
    pricePerTaskUsd: pricingModel.summary
  }
];

function createHash(seed: number): string {
  return `0x${seed.toString(16).padStart(64, "0")}`;
}

function buildTasks(): MicroTask[] {
  return [
    {
      id: "task-01",
      title: "Identify top Arc-native competitors",
      description: "Find 5 products at the intersection of AI agents and micropayments.",
      assignedAgentId: "agent-research",
      status: "completed",
      priceUsd: pricingModel.research,
      evidenceHash: "QmSourceBundle01",
      resultPreview: "Identified 5 competing products and mapped their payment models."
    },
    {
      id: "task-02",
      title: "Validate public product claims",
      description: "Cross-check claims against landing pages, docs, and public demos.",
      assignedAgentId: "agent-fact-check",
      status: "completed",
      priceUsd: pricingModel.factCheck,
      evidenceHash: "QmSourceBundle02",
      resultPreview: "Flagged two unsupported claims and confirmed three claims with sources."
    },
    {
      id: "task-03",
      title: "Summarize strategic whitespace",
      description: "Produce a concise summary of where the market is still under-served.",
      assignedAgentId: "agent-summary",
      status: "completed",
      priceUsd: pricingModel.summary,
      evidenceHash: "QmSourceBundle03",
      resultPreview: "Whitespace centers on transparent pricing, agent reputation, and fast settlement."
    },
    {
      id: "task-04",
      title: "Map monetization models",
      description: "Compare subscription, credit-based, and pay-per-action pricing designs.",
      assignedAgentId: "agent-research",
      status: "completed",
      priceUsd: pricingModel.research,
      evidenceHash: "QmSourceBundle04",
      resultPreview: "Pay-per-action gives the clearest fit for machine-to-machine commerce."
    },
    {
      id: "task-05",
      title: "Assemble final investment memo",
      description: "Roll up validated findings into a founder-ready report.",
      assignedAgentId: "agent-summary",
      status: "completed",
      priceUsd: pricingModel.summary,
      evidenceHash: "QmSourceBundle05",
      resultPreview: "Final memo prepared with market map, risk notes, and next-step recommendations."
    }
  ];
}

function buildTransactions(tasks: MicroTask[]): TxLog[] {
  return tasks.flatMap((task, index) => {
    const baseSeed = index + 1;

    return [
      {
        id: `${task.id}-create`,
        label: `Create job for ${task.title}`,
        hash: createHash(baseSeed),
        status: "confirmed",
        amountUsd: 0,
        explorerUrl: buildExplorerUrl(createHash(baseSeed)),
        createdAt: `2026-04-15T10:${10 + index}:00Z`
      },
      {
        id: `${task.id}-fund`,
        label: `Fund escrow for ${task.title}`,
        hash: createHash(baseSeed + 100),
        status: "confirmed",
        amountUsd: task.priceUsd,
        explorerUrl: buildExplorerUrl(createHash(baseSeed + 100)),
        createdAt: `2026-04-15T10:${11 + index}:00Z`
      },
      {
        id: `${task.id}-submit`,
        label: `Submit deliverable for ${task.title}`,
        hash: createHash(baseSeed + 200),
        status: "confirmed",
        amountUsd: 0,
        explorerUrl: buildExplorerUrl(createHash(baseSeed + 200)),
        createdAt: `2026-04-15T10:${12 + index}:00Z`
      },
      {
        id: `${task.id}-complete`,
        label: `Complete settlement for ${task.title}`,
        hash: createHash(baseSeed + 300),
        status: "confirmed",
        amountUsd: task.priceUsd,
        explorerUrl: buildExplorerUrl(createHash(baseSeed + 300)),
        createdAt: `2026-04-15T10:${13 + index}:00Z`
      }
    ];
  });
}

function buildEconomics(project: ResearchProject): EconomicsSummary {
  const totalUsdSpent = project.tasks.reduce((sum, task) => sum + task.priceUsd, 0);
  const totalTransactions = project.transactions.length;

  return {
    totalTasks: project.tasks.length,
    totalTransactions,
    totalUsdSpent,
    averageTaskPriceUsd: totalUsdSpent / project.tasks.length,
    averageTransactionCostUsd: totalUsdSpent / totalTransactions
  };
}

export function getDashboardSnapshot(): DashboardSnapshot {
  const tasks = buildTasks();
  const transactions = buildTransactions(tasks);

  const project: ResearchProject = {
    id: "project-arc-agents",
    title: "Competitive intelligence for Arc-native agent payments",
    brief:
      "Analyze five competitors, validate their claims, and compile a strategic memo for an Arc hackathon team.",
    finalReport:
      "The market is crowded with generic AI wrappers but still under-served in verifiable agent-to-agent settlement. Arc is strongest where fast stablecoin settlement, agent identity, and granular task pricing converge.",
    status: "completed",
    tasks,
    transactions
  };

  return {
    project,
    agents: baseAgents,
    economics: buildEconomics(project)
  };
}

export function simulateExpandedRun(): DashboardSnapshot {
  const base = getDashboardSnapshot();
  const extraTasks: MicroTask[] = Array.from({ length: 10 }, (_, index) => ({
    id: `task-extra-${index + 1}`,
    title: `Additional research sweep ${index + 1}`,
    description: "Expand sector coverage and price intelligence for a secondary category.",
    assignedAgentId: index % 2 === 0 ? "agent-research" : "agent-fact-check",
    status: "completed",
    priceUsd: index % 2 === 0 ? pricingModel.research : pricingModel.factCheck,
    evidenceHash: `QmExtra${index + 1}`,
    resultPreview: "Collected and validated additional sources."
  }));

  const project: ResearchProject = {
    ...base.project,
    status: "running",
    tasks: [...base.project.tasks, ...extraTasks]
  };

  project.transactions = buildTransactions(project.tasks);
  project.status = "completed";

  return {
    project,
    agents: base.agents,
    economics: buildEconomics(project)
  };
}
