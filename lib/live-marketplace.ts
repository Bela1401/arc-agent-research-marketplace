import { formatUnits, getContract } from "viem";
import {
  ARC_CONTRACTS,
  agenticCommerceAbi,
  agenticCommerceStatusNames,
  buildExplorerAddressUrl,
  buildExplorerUrl,
  pricingModel
} from "@/lib/arc";
import { getArcPublicClient } from "@/lib/circle";
import { getOptionalAddress } from "@/lib/hackathon-env";
import { liveArcProof } from "@/lib/live-proof";
import { getConfiguredIntegrationStatus, type MarketplaceProviderRole } from "@/lib/marketplace-integration";

type Address = `0x${string}`;
type Hex = `0x${string}`;

const RECENT_RUN_LIMIT = 6;
const RECENT_BLOCK_WINDOW = 120_000n;
const LOG_RANGE_STEP = 9_500n;

const providerCatalog = {
  research: {
    role: "research",
    name: "Signal Scout",
    label: "Research",
    specialty: "Competitive landscape scans, source discovery, and market mapping.",
    payoutUsd: pricingModel.research,
    validationLabel: "research_verified"
  },
  factCheck: {
    role: "factCheck",
    name: "Proof Engine",
    label: "Fact-check",
    specialty: "Claim validation, evidence review, and credibility scoring.",
    payoutUsd: pricingModel.factCheck,
    validationLabel: "factcheck_verified"
  },
  summary: {
    role: "summary",
    name: "Brief Forge",
    label: "Summary",
    specialty: "Executive synthesis, prioritization, and monetizable final reports.",
    payoutUsd: pricingModel.summary,
    validationLabel: "summary_verified"
  }
} as const satisfies Record<
  MarketplaceProviderRole,
  {
    role: MarketplaceProviderRole;
    name: string;
    label: string;
    specialty: string;
    payoutUsd: number;
    validationLabel: string;
  }
>;

const fallbackWalletMap = Object.fromEntries(
  liveArcProof.wallets.map((wallet) => [wallet.role, wallet.address])
) as Record<string, Address>;

export interface RecentRunTxLink {
  label: string;
  hash: Hex;
  explorerUrl: string;
}

export interface RecentArcRun {
  jobId: string;
  providerRole: MarketplaceProviderRole | "unknown";
  providerLabel: string;
  providerName: string;
  providerWallet: Address;
  providerExplorerUrl: string;
  clientWallet: Address;
  clientExplorerUrl: string;
  description: string;
  budgetUsd: number;
  status: string;
  createdAtIso: string;
  createdAtLabel: string;
  createTxHash: Hex;
  createTxExplorerUrl: string;
  txTrail: RecentRunTxLink[];
  trailCoverageLabel: string;
}

export interface RecentRunsSummary {
  source: "rpc" | "proof-fallback";
  note: string;
  runs: RecentArcRun[];
  metrics: {
    visibleRuns: number;
    txLinksVisible: number;
    averageBudgetUsd: number;
    latestCreatedAtLabel: string;
    totalBudgetUsd: number;
  };
}

export interface AgentRegistryEntry {
  id: string;
  role: "validator" | "client" | MarketplaceProviderRole;
  name: string;
  walletAddress: Address;
  walletExplorerUrl: string;
  specialty: string;
  payoutLabel: string;
  validationLabel: string;
}

export interface PremiumReportSummary {
  unlockPriceUsd: number;
  sellerAddress: Address;
  sellerExplorerUrl: string;
  paymentRail: string;
  endpointPath: string;
  teaserPath: string;
  summary: string;
  highlights: string[];
}

export interface MarginCalculatorSeed {
  averageArcLegUsd: number;
  defaultLegs: number;
  defaultUnlockPriceUsd: number;
  defaultExpectedUnlocks: number;
  defaultTraditionalGasUsd: number;
  breakEvenUnlocks: number;
}

export interface PremiumResearchReport {
  generatedAt: string;
  title: string;
  summary: string;
  monetization: {
    unlockPriceUsd: number;
    endpointPath: string;
    paymentRail: string;
    sellerAddress: Address;
    sellerExplorerUrl: string;
  };
  recentRuns: Array<{
    jobId: string;
    providerRole: string;
    providerName: string;
    budgetUsd: number;
    status: string;
    createdAt: string;
    createTxExplorerUrl: string;
  }>;
  marketGaps: string[];
  unitEconomics: {
    averageArcLegUsd: number;
    estimatedArcReportCreationUsd: number;
    unlockPriceUsd: number;
    breakEvenUnlocks: number;
    estimatedTraditionalGasPerUnlockUsd: number;
  };
  whyArcWins: string[];
}

export interface PremiumResearchTeaser {
  title: string;
  summary: string;
  unlockPriceUsd: number;
  paymentRail: string;
  endpointPath: string;
  sellerAddress: Address;
  latestJobs: Array<{
    jobId: string;
    providerRole: string;
    budgetUsd: number;
    status: string;
  }>;
  highlights: string[];
}

function normalizeAddress(address: string | null | undefined): string {
  return address?.toLowerCase() ?? "";
}

function formatTimestamp(unixSeconds: number): { iso: string; label: string } {
  const date = new Date(unixSeconds * 1_000);

  return {
    iso: date.toISOString(),
    label: `${new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "UTC"
    }).format(date)} UTC`
  };
}

function buildKnownTrailMap() {
  return new Map(
    liveArcProof.jobs.map((job) => [job.id.toString(), job.transactions] as const)
  );
}

function buildRoleMap() {
  const status = getConfiguredIntegrationStatus();

  const entries = [
    {
      address: (status.researchWalletAddress ?? fallbackWalletMap.research) as Address,
      role: "research" as const
    },
    {
      address: (status.factCheckWalletAddress ?? fallbackWalletMap["fact-check"]) as Address,
      role: "factCheck" as const
    },
    {
      address: (status.summaryWalletAddress ?? fallbackWalletMap.summary) as Address,
      role: "summary" as const
    }
  ];

  return new Map(
    entries
      .filter((entry) => entry.address)
      .map((entry) => [
        normalizeAddress(entry.address),
        {
          role: entry.role,
          providerName: providerCatalog[entry.role].name,
          providerLabel: providerCatalog[entry.role].label
        }
      ])
  );
}

function buildMetrics(runs: RecentArcRun[]): RecentRunsSummary["metrics"] {
  const totalBudgetUsd = runs.reduce((sum, run) => sum + run.budgetUsd, 0);
  const txLinksVisible = runs.reduce((sum, run) => sum + run.txTrail.length, 0);
  const latestCreatedAtLabel = runs[0]?.createdAtLabel ?? "No live jobs yet";

  return {
    visibleRuns: runs.length,
    txLinksVisible,
    averageBudgetUsd: runs.length > 0 ? totalBudgetUsd / runs.length : pricingModel.summary,
    latestCreatedAtLabel,
    totalBudgetUsd
  };
}

function buildFallbackRecentRuns(limit = RECENT_RUN_LIMIT): RecentRunsSummary {
  const runs = [...liveArcProof.jobs]
    .reverse()
    .slice(0, limit)
    .map((job) => ({
      jobId: job.id.toString(),
      providerRole: (job.role === "factCheck" ? "factCheck" : job.role) as MarketplaceProviderRole,
      providerLabel:
        job.role === "factCheck" ? providerCatalog.factCheck.label : providerCatalog[job.role].label,
      providerName: job.providerName,
      providerWallet: job.providerWallet,
      providerExplorerUrl: buildExplorerAddressUrl(job.providerWallet),
      clientWallet: (fallbackWalletMap.client ?? liveArcProof.wallets[1].address) as Address,
      clientExplorerUrl: buildExplorerAddressUrl(
        (fallbackWalletMap.client ?? liveArcProof.wallets[1].address) as Address
      ),
      description: `${job.providerName} completed the ${job.role} leg of the Arc research marketplace.`,
      budgetUsd: job.budgetUsd,
      status: "Completed",
      createdAtIso: `${liveArcProof.capturedAt}T00:00:00.000Z`,
      createdAtLabel: `${liveArcProof.capturedAt} UTC`,
      createTxHash: job.transactions[0]?.hash ?? "0x",
      createTxExplorerUrl: job.transactions[0]?.explorerUrl ?? buildExplorerUrl(job.transactions[0]?.hash ?? "0x"),
      txTrail: job.transactions,
      trailCoverageLabel: "Archived full tx trail"
    }));

  return {
    source: "proof-fallback",
    note:
      "The live RPC feed was unavailable, so the homepage fell back to the archived proof set captured from real Arc runs.",
    runs,
    metrics: buildMetrics(runs)
  };
}

export function getAgentRegistryEntries(): AgentRegistryEntry[] {
  const status = getConfiguredIntegrationStatus();

  return [
    {
      id: "validator",
      role: "validator",
      name: "Validator Wallet",
      walletAddress: (status.validatorWalletAddress ?? fallbackWalletMap.validator) as Address,
      walletExplorerUrl: buildExplorerAddressUrl(
        (status.validatorWalletAddress ?? fallbackWalletMap.validator) as Address
      ),
      specialty: "Writes validation and reputation updates for provider agents.",
      payoutLabel: "Quality assurance lane",
      validationLabel: "validator_feedback"
    },
    {
      id: "client",
      role: "client",
      name: "Client Wallet",
      walletAddress: (status.clientWalletAddress ?? fallbackWalletMap.client) as Address,
      walletExplorerUrl: buildExplorerAddressUrl(
        (status.clientWalletAddress ?? fallbackWalletMap.client) as Address
      ),
      specialty: "Funds work, approves USDC, and closes ERC-8183 settlements.",
      payoutLabel: "Pays every specialist separately",
      validationLabel: "job_funder"
    },
    ...(["research", "factCheck", "summary"] as const).map((role) => {
      const configuredWallets = {
        research: status.researchWalletAddress,
        factCheck: status.factCheckWalletAddress,
        summary: status.summaryWalletAddress
      } as const;
      const fallbackWallets = {
        research: fallbackWalletMap.research,
        factCheck: fallbackWalletMap["fact-check"],
        summary: fallbackWalletMap.summary
      } as const;
      const walletAddress = (configuredWallets[role] ?? fallbackWallets[role]) as Address;

      return {
        id: role,
        role,
        name: providerCatalog[role].name,
        walletAddress,
        walletExplorerUrl: buildExplorerAddressUrl(walletAddress),
        specialty: providerCatalog[role].specialty,
        payoutLabel: `${providerCatalog[role].payoutUsd.toFixed(3)} USDC per specialist leg`,
        validationLabel: providerCatalog[role].validationLabel
      };
    })
  ];
}

export async function getRecentArcRuns(limit = RECENT_RUN_LIMIT): Promise<RecentRunsSummary> {
  const publicClient = getArcPublicClient();
  const latestBlock = await publicClient.getBlockNumber();
  const fromBlock = latestBlock > RECENT_BLOCK_WINDOW ? latestBlock - RECENT_BLOCK_WINDOW : 0n;
  const jobCreatedEvent = agenticCommerceAbi.find(
    (item): item is Extract<(typeof agenticCommerceAbi)[number], { type: "event"; name: "JobCreated" }> =>
      item.type === "event" && item.name === "JobCreated"
  );

  if (!jobCreatedEvent) {
    throw new Error("JobCreated event is missing from the Arc ABI.");
  }

  const recentLogs = [];
  let currentToBlock = latestBlock;

  while (currentToBlock >= fromBlock && recentLogs.length < limit) {
    const currentFromBlock =
      currentToBlock > LOG_RANGE_STEP ? currentToBlock - LOG_RANGE_STEP : 0n;

    const logs = await publicClient.getLogs({
      address: ARC_CONTRACTS.agenticCommerce,
      event: jobCreatedEvent,
      fromBlock: currentFromBlock < fromBlock ? fromBlock : currentFromBlock,
      toBlock: currentToBlock
    });

    recentLogs.push(...[...logs].reverse());

    if (currentFromBlock <= fromBlock) {
      break;
    }

    currentToBlock = currentFromBlock - 1n;
  }

  recentLogs.length = Math.min(recentLogs.length, limit);
  const knownTrailMap = buildKnownTrailMap();
  const roleMap = buildRoleMap();
  const contract = getContract({
    address: ARC_CONTRACTS.agenticCommerce,
    abi: agenticCommerceAbi,
    client: publicClient
  });

  const runs = await Promise.all(
    recentLogs.map(async (log) => {
      const job = await contract.read.getJob([log.args.jobId]);
      const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
      const providerWallet = job.provider as Address;
      const clientWallet = job.client as Address;
      const providerInfo = roleMap.get(normalizeAddress(providerWallet));
      const timestamp = formatTimestamp(Number(block.timestamp));
      const jobId = log.args.jobId.toString();
      const txTrail =
        knownTrailMap.get(jobId) ??
        [
          {
            label: "Create job",
            hash: log.transactionHash,
            explorerUrl: buildExplorerUrl(log.transactionHash)
          }
        ];

      return {
        jobId,
        providerRole: providerInfo?.role ?? "unknown",
        providerLabel: providerInfo?.providerLabel ?? "Unknown provider",
        providerName: providerInfo?.providerName ?? "Unmapped specialist",
        providerWallet,
        providerExplorerUrl: buildExplorerAddressUrl(providerWallet),
        clientWallet,
        clientExplorerUrl: buildExplorerAddressUrl(clientWallet),
        description: job.description,
        budgetUsd: Number(formatUnits(job.budget, 6)),
        status: agenticCommerceStatusNames[Number(job.status)] ?? `Unknown(${job.status})`,
        createdAtIso: timestamp.iso,
        createdAtLabel: timestamp.label,
        createTxHash: log.transactionHash,
        createTxExplorerUrl: buildExplorerUrl(log.transactionHash),
        txTrail,
        trailCoverageLabel:
          knownTrailMap.has(jobId) ? "Full tx trail captured" : "Creation tx discovered live"
      } satisfies RecentArcRun;
    })
  );

  return {
    source: "rpc",
    note:
      "Recent runs are fetched live from Arc contract logs, then enriched with known transaction trails when available.",
    runs,
    metrics: buildMetrics(runs)
  };
}

export async function getRecentRunsSummary(): Promise<RecentRunsSummary> {
  try {
    return await getRecentArcRuns();
  } catch {
    return buildFallbackRecentRuns();
  }
}

export async function getPremiumReportSummary(
  recentRunsInput?: RecentRunsSummary
): Promise<PremiumReportSummary> {
  const envPrice = Number(process.env.ARC_REPORT_PRICE_USDC ?? "0.005");
  const agents = getAgentRegistryEntries();
  const seller =
    agents.find((agent) => agent.role === "summary") ??
    agents.find((agent) => agent.role === "client") ??
    agents[0];
  const recentRuns = recentRunsInput ?? (await getRecentRunsSummary());

  return {
    unlockPriceUsd: envPrice,
    sellerAddress: getOptionalAddress(process.env.ARC_REPORT_SELLER_ADDRESS) ?? seller.walletAddress,
    sellerExplorerUrl: buildExplorerAddressUrl(
      getOptionalAddress(process.env.ARC_REPORT_SELLER_ADDRESS) ?? seller.walletAddress
    ),
    paymentRail: "x402 + Circle Gateway batching on Arc Testnet",
    endpointPath: "/api/reports/premium",
    teaserPath: "/api/reports/teaser",
    summary:
      "The same research pipeline can now become inventory: generate once on Arc, then resell the full report per unlock with x402-compatible micropayments.",
    highlights: [
      `Unlock price is ${envPrice.toFixed(3)} USDC per full report access.`,
      `Seller wallet is the ${seller.name.toLowerCase()} so revenue lands on a real Arc address.`,
      `Latest visible run is job #${recentRuns.runs[0]?.jobId ?? "n/a"} with explorer-ready proof links.`
    ]
  };
}

export async function getMarginCalculatorSeed(
  recentRunsInput?: RecentRunsSummary,
  premiumInput?: PremiumReportSummary
): Promise<MarginCalculatorSeed> {
  const recentRuns = recentRunsInput ?? (await getRecentRunsSummary());
  const premium = premiumInput ?? (await getPremiumReportSummary(recentRuns));
  const averageArcLegUsd = recentRuns.metrics.averageBudgetUsd || pricingModel.summary;
  const defaultLegs = 3;
  const defaultExpectedUnlocks = 10;
  const breakEvenUnlocks = Math.ceil((averageArcLegUsd * defaultLegs) / premium.unlockPriceUsd);

  return {
    averageArcLegUsd,
    defaultLegs,
    defaultUnlockPriceUsd: premium.unlockPriceUsd,
    defaultExpectedUnlocks,
    defaultTraditionalGasUsd: 0.35,
    breakEvenUnlocks
  };
}

export async function buildPremiumResearchReport(
  recentRunsInput?: RecentRunsSummary,
  premiumInput?: PremiumReportSummary,
  calculatorSeedInput?: MarginCalculatorSeed
): Promise<PremiumResearchReport> {
  const recentRuns = recentRunsInput ?? (await getRecentRunsSummary());
  const premium = premiumInput ?? (await getPremiumReportSummary(recentRuns));
  const calculatorSeed =
    calculatorSeedInput ?? (await getMarginCalculatorSeed(recentRuns, premium));
  const estimatedArcReportCreationUsd = calculatorSeed.averageArcLegUsd * calculatorSeed.defaultLegs;

  return {
    generatedAt: new Date().toISOString(),
    title: "Arc Agent Research Marketplace: Premium Competitive Report",
    summary:
      "Arc turns specialist agent work into something you can both settle cheaply and resell cleanly. The report below packages recent Arc execution evidence, the strongest market whitespace, and why pay-per-report breaks on higher-friction payment rails.",
    monetization: {
      unlockPriceUsd: premium.unlockPriceUsd,
      endpointPath: premium.endpointPath,
      paymentRail: premium.paymentRail,
      sellerAddress: premium.sellerAddress,
      sellerExplorerUrl: premium.sellerExplorerUrl
    },
    recentRuns: recentRuns.runs.slice(0, 5).map((run) => ({
      jobId: run.jobId,
      providerRole: run.providerLabel,
      providerName: run.providerName,
      budgetUsd: run.budgetUsd,
      status: run.status,
      createdAt: run.createdAtLabel,
      createTxExplorerUrl: run.createTxExplorerUrl
    })),
    marketGaps: [
      "Most AI agent products still monetize through seats, credits, or hidden internal orchestration rather than verifiable pay-per-step execution.",
      "Reusable research artifacts are rarely packaged as machine-buyable inventory, which leaves agent-to-agent resale underdeveloped.",
      "Fast stablecoin settlement only becomes compelling when the per-action economics are low enough to keep specialist steps discrete."
    ],
    unitEconomics: {
      averageArcLegUsd: calculatorSeed.averageArcLegUsd,
      estimatedArcReportCreationUsd,
      unlockPriceUsd: premium.unlockPriceUsd,
      breakEvenUnlocks: calculatorSeed.breakEvenUnlocks,
      estimatedTraditionalGasPerUnlockUsd: calculatorSeed.defaultTraditionalGasUsd
    },
    whyArcWins: [
      "A three-leg report on Arc stays in the cents range, which keeps specialist routing economically visible instead of forcing bundles or subscriptions.",
      `At ${premium.unlockPriceUsd.toFixed(3)} USDC per premium unlock, the same report can be resold without the payment overhead swamping the sale itself.`,
      "On a traditional gas-heavy path, the unlock rail becomes more expensive than the unlock price, so teams retreat to off-chain credits and lose the machine-native commerce story."
    ]
  };
}

export async function buildPremiumResearchTeaser(): Promise<PremiumResearchTeaser> {
  const recentRuns = await getRecentRunsSummary();
  const premium = await getPremiumReportSummary(recentRuns);
  const calculatorSeed = await getMarginCalculatorSeed(recentRuns, premium);
  const report = await buildPremiumResearchReport(recentRuns, premium, calculatorSeed);

  return {
    title: report.title,
    summary:
      "Free teaser: the full report includes recent Arc execution evidence, monetization math, and the complete market-gap analysis.",
    unlockPriceUsd: report.monetization.unlockPriceUsd,
    paymentRail: report.monetization.paymentRail,
    endpointPath: report.monetization.endpointPath,
    sellerAddress: report.monetization.sellerAddress,
    latestJobs: report.recentRuns.slice(0, 3).map((run) => ({
      jobId: run.jobId,
      providerRole: run.providerRole,
      budgetUsd: run.budgetUsd,
      status: run.status
    })),
    highlights: [
      report.marketGaps[0] ?? "Agent marketplaces still struggle to monetize per result.",
      report.marketGaps[1] ?? "Reusable agent outputs remain hard to resell cleanly.",
      report.whyArcWins[0] ?? "Arc keeps micropayment settlement economically viable."
    ]
  };
}
