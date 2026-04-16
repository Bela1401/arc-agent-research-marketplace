export type AgentRole = "manager" | "researcher" | "fact_checker" | "summarizer";

export type TaskStatus =
  | "queued"
  | "funded"
  | "running"
  | "submitted"
  | "completed";

export type TxStatus = "pending" | "confirmed";

export interface AgentProfile {
  id: string;
  name: string;
  role: AgentRole;
  specialty: string;
  reputationScore: number;
  walletAddress: string;
  identityId: string;
  pricePerTaskUsd: number;
}

export interface MicroTask {
  id: string;
  title: string;
  description: string;
  assignedAgentId: string;
  status: TaskStatus;
  priceUsd: number;
  evidenceHash?: string;
  resultPreview?: string;
}

export interface TxLog {
  id: string;
  label: string;
  hash: string;
  status: TxStatus;
  amountUsd: number;
  explorerUrl: string;
  createdAt: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  brief: string;
  finalReport: string;
  status: "draft" | "running" | "completed";
  tasks: MicroTask[];
  transactions: TxLog[];
}

export interface EconomicsSummary {
  totalTasks: number;
  totalTransactions: number;
  totalUsdSpent: number;
  averageTaskPriceUsd: number;
  averageTransactionCostUsd: number;
}

export interface DashboardSnapshot {
  project: ResearchProject;
  agents: AgentProfile[];
  economics: EconomicsSummary;
}
