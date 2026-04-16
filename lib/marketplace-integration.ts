import { getCircleClient } from "@/lib/circle";
import { getServerHackathonEnv } from "@/lib/hackathon-env";
import { registerArcAgent, type RegisterArcAgentResult } from "@/lib/erc8004";
import { runErc8183Job, type RunErc8183JobResult } from "@/lib/erc8183";

type Address = `0x${string}`;

export type MarketplaceProviderRole = "research" | "factCheck" | "summary";

export interface BootstrappedWallet {
  role: "validator" | "client" | MarketplaceProviderRole;
  id: string;
  address: Address;
}

const providerRoleConfig: Record<
  MarketplaceProviderRole,
  { walletEnvKey: keyof ReturnType<typeof getServerHackathonEnv>; metadataEnvKey: keyof ReturnType<typeof getServerHackathonEnv> }
> = {
  research: {
    walletEnvKey: "ARC_RESEARCH_WALLET_ADDRESS",
    metadataEnvKey: "ARC_RESEARCH_METADATA_URI"
  },
  factCheck: {
    walletEnvKey: "ARC_FACT_CHECK_WALLET_ADDRESS",
    metadataEnvKey: "ARC_FACT_CHECK_METADATA_URI"
  },
  summary: {
    walletEnvKey: "ARC_SUMMARY_WALLET_ADDRESS",
    metadataEnvKey: "ARC_SUMMARY_METADATA_URI"
  }
};

export function getConfiguredIntegrationStatus() {
  const env = process.env;

  return {
    walletSetName: env.ARC_WALLET_SET_NAME ?? "Arc Hackathon Wallets",
    validatorWalletAddress: env.ARC_VALIDATOR_WALLET_ADDRESS ?? null,
    clientWalletAddress: env.ARC_CLIENT_WALLET_ADDRESS ?? null,
    researchWalletAddress: env.ARC_RESEARCH_WALLET_ADDRESS ?? null,
    factCheckWalletAddress: env.ARC_FACT_CHECK_WALLET_ADDRESS ?? null,
    summaryWalletAddress: env.ARC_SUMMARY_WALLET_ADDRESS ?? null,
    jobBudgetUsd: env.ARC_JOB_BUDGET_USDC ? Number(env.ARC_JOB_BUDGET_USDC) : 0.008,
    providerStarterBalanceUsd: env.ARC_PROVIDER_STARTER_BALANCE_USDC
      ? Number(env.ARC_PROVIDER_STARTER_BALANCE_USDC)
      : 0.05,
    readyForAgentRegistration:
      Boolean(env.ARC_VALIDATOR_WALLET_ADDRESS) &&
      Boolean(env.ARC_RESEARCH_WALLET_ADDRESS || env.ARC_FACT_CHECK_WALLET_ADDRESS || env.ARC_SUMMARY_WALLET_ADDRESS),
    readyForJobExecution: Boolean(env.ARC_CLIENT_WALLET_ADDRESS)
  };
}

export async function bootstrapHackathonWallets(): Promise<{
  walletSetId: string;
  wallets: BootstrappedWallet[];
  envSnippet: string;
}> {
  const env = getServerHackathonEnv();
  const circleClient = getCircleClient();

  const walletSet = await circleClient.createWalletSet({
    name: env.ARC_WALLET_SET_NAME
  });

  const walletResponse = await circleClient.createWallets({
    blockchains: ["ARC-TESTNET"],
    count: 5,
    walletSetId: walletSet.data?.walletSet?.id ?? "",
    accountType: "SCA"
  });

  const wallets = walletResponse.data?.wallets ?? [];
  const roleOrder: BootstrappedWallet["role"][] = [
    "validator",
    "client",
    "research",
    "factCheck",
    "summary"
  ];

  const bootstrapped = roleOrder.map((role, index) => {
    const wallet = wallets[index];

    if (!wallet?.id || !wallet.address) {
      throw new Error(`Missing wallet for ${role}`);
    }

    return {
      role,
      id: wallet.id,
      address: wallet.address as Address
    };
  });

  const envSnippet = [
    `ARC_VALIDATOR_WALLET_ADDRESS=${bootstrapped[0].address}`,
    `ARC_CLIENT_WALLET_ADDRESS=${bootstrapped[1].address}`,
    `ARC_RESEARCH_WALLET_ADDRESS=${bootstrapped[2].address}`,
    `ARC_FACT_CHECK_WALLET_ADDRESS=${bootstrapped[3].address}`,
    `ARC_SUMMARY_WALLET_ADDRESS=${bootstrapped[4].address}`
  ].join("\n");

  return {
    walletSetId: walletSet.data?.walletSet?.id ?? "",
    wallets: bootstrapped,
    envSnippet
  };
}

function getProviderWallet(role: MarketplaceProviderRole, env: ReturnType<typeof getServerHackathonEnv>) {
  const config = providerRoleConfig[role];
  const walletAddress = env[config.walletEnvKey];

  if (!walletAddress) {
    throw new Error(`Missing ${config.walletEnvKey} in environment`);
  }

  return {
    walletAddress: walletAddress as Address,
    metadataUri: env[config.metadataEnvKey] as string
  };
}

export async function registerConfiguredMarketplaceAgents(
  roles: MarketplaceProviderRole[] = ["research", "factCheck", "summary"]
): Promise<RegisterArcAgentResult[]> {
  const env = getServerHackathonEnv();

  if (!env.ARC_VALIDATOR_WALLET_ADDRESS) {
    throw new Error("Missing ARC_VALIDATOR_WALLET_ADDRESS in environment");
  }

  const validatorWalletAddress = env.ARC_VALIDATOR_WALLET_ADDRESS as Address;

  const results: RegisterArcAgentResult[] = [];
  for (const role of roles) {
    const provider = getProviderWallet(role, env);
    const validationTag = `${role.toLowerCase()}_verified`;

    results.push(
      await registerArcAgent({
        agentWalletAddress: provider.walletAddress,
        validatorWalletAddress,
        metadataUri: provider.metadataUri,
        reputationScore: env.ARC_AGENT_REPUTATION_SCORE,
        reputationTag: `${role.toLowerCase()}_agent_ready`,
        validationTag,
        validationRequestUri: provider.metadataUri
      })
    );
  }

  return results;
}

export async function runConfiguredMarketplaceJob(
  providerRole: MarketplaceProviderRole,
  description?: string
): Promise<RunErc8183JobResult> {
  const env = getServerHackathonEnv();

  if (!env.ARC_CLIENT_WALLET_ADDRESS) {
    throw new Error("Missing ARC_CLIENT_WALLET_ADDRESS in environment");
  }

  const provider = getProviderWallet(providerRole, env);

  return runErc8183Job({
    clientWalletAddress: env.ARC_CLIENT_WALLET_ADDRESS as Address,
    providerWalletAddress: provider.walletAddress,
    description:
      description ??
      `Complete ${providerRole} agent microtask for the Arc hackathon research marketplace`,
    budgetUsd: env.ARC_JOB_BUDGET_USDC,
    providerStarterBalanceUsd: env.ARC_PROVIDER_STARTER_BALANCE_USDC,
    deliverableLabel: `${providerRole}-agent-deliverable`,
    completionReason: "agentic-marketplace-approved"
  });
}
