import { setTimeout as delay } from "node:timers/promises";
import {
  type CircleDeveloperControlledWalletsClient,
  initiateDeveloperControlledWalletsClient
} from "@circle-fin/developer-controlled-wallets";
import { createPublicClient, http } from "viem";
import { ARC_BLOCKCHAIN, ARC_CONTRACTS, arcTestnet, buildExplorerUrl } from "@/lib/arc";
import { getServerHackathonEnv } from "@/lib/hackathon-env";

type Address = `0x${string}`;
type Hex = `0x${string}`;

export interface WalletSummary {
  id?: string;
  address?: Address | null;
}

export interface CircleTxResult {
  id: string;
  txHash: Hex;
  explorerUrl: string;
}

export function getCircleClient(): CircleDeveloperControlledWalletsClient {
  const env = getServerHackathonEnv();

  return initiateDeveloperControlledWalletsClient({
    apiKey: env.CIRCLE_API_KEY,
    entitySecret: env.CIRCLE_ENTITY_SECRET
  });
}

export function getArcPublicClient() {
  const env = getServerHackathonEnv();

  return createPublicClient({
    chain: arcTestnet as never,
    transport: http(env.NEXT_PUBLIC_ARC_RPC_URL)
  });
}

export async function waitForCircleTransaction(
  circleClient: CircleDeveloperControlledWalletsClient,
  txId: string,
  label: string,
  attempts = 60
): Promise<CircleTxResult> {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await delay(2_000);

    const response = await circleClient.getTransaction({ id: txId });
    const transaction = response.data?.transaction;

    if (transaction?.state === "COMPLETE" && transaction.txHash) {
      return {
        id: txId,
        txHash: transaction.txHash as Hex,
        explorerUrl: buildExplorerUrl(transaction.txHash)
      };
    }

    if (transaction?.state === "FAILED") {
      throw new Error(`${label} failed onchain`);
    }
  }

  throw new Error(`${label} timed out`);
}

export async function getUsdcBalance(
  circleClient: CircleDeveloperControlledWalletsClient,
  walletId: string
): Promise<string> {
  const balances = await circleClient.getWalletTokenBalance({ id: walletId });
  const usdc = balances.data?.tokenBalances?.find(
    (balance) => balance.token?.tokenAddress === ARC_CONTRACTS.usdc || balance.token?.symbol === "USDC"
  );

  return usdc?.amount ?? "0";
}

export function getArcBlockchainName(): typeof ARC_BLOCKCHAIN {
  return ARC_BLOCKCHAIN;
}
