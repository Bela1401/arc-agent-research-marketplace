import {
  decodeEventLog,
  formatUnits,
  getContract,
  keccak256,
  parseUnits,
  toHex
} from "viem";
import {
  ARC_CONTRACTS,
  agenticCommerceAbi,
  agenticCommerceStatusNames
} from "@/lib/arc";
import {
  getArcBlockchainName,
  getArcPublicClient,
  getCircleClient,
  waitForCircleTransaction
} from "@/lib/circle";

type Address = `0x${string}`;
type Hex = `0x${string}`;

export interface RunErc8183JobInput {
  clientWalletAddress: Address;
  providerWalletAddress: Address;
  description: string;
  budgetUsd: number;
  providerStarterBalanceUsd?: number;
  expiresInSeconds?: number;
  deliverableLabel?: string;
  completionReason?: string;
}

export interface RunErc8183JobResult {
  jobId: string;
  status: string;
  budgetUsd: string;
  deliverableHash: Hex;
  txHashes: {
    transferStarter?: Hex;
    createJob: Hex;
    setBudget: Hex;
    approve: Hex;
    fund: Hex;
    submit: Hex;
    complete: Hex;
  };
}

async function extractJobId(txHash: Hex): Promise<bigint> {
  const publicClient = getArcPublicClient();
  const receipt = await publicClient.getTransactionReceipt({ hash: txHash });

  for (const log of receipt.logs) {
    try {
      const decoded = decodeEventLog({
        abi: agenticCommerceAbi,
        data: log.data,
        topics: log.topics
      });

      if (decoded.eventName === "JobCreated") {
        return decoded.args.jobId;
      }
    } catch {
      continue;
    }
  }

  throw new Error("Could not parse JobCreated event");
}

export async function runErc8183Job(
  input: RunErc8183JobInput
): Promise<RunErc8183JobResult> {
  const circleClient = getCircleClient();
  const publicClient = getArcPublicClient();
  const txHashes: RunErc8183JobResult["txHashes"] = {
    createJob: "0x",
    setBudget: "0x",
    approve: "0x",
    fund: "0x",
    submit: "0x",
    complete: "0x"
  };

  if (input.providerStarterBalanceUsd && input.providerStarterBalanceUsd > 0) {
    const transferTx = await circleClient.createTransaction({
      walletAddress: input.clientWalletAddress,
      blockchain: getArcBlockchainName(),
      tokenAddress: ARC_CONTRACTS.usdc,
      destinationAddress: input.providerWalletAddress,
      amount: [input.providerStarterBalanceUsd.toString()],
      fee: { type: "level", config: { feeLevel: "MEDIUM" } }
    });

    const transferReceipt = await waitForCircleTransaction(
      circleClient,
      transferTx.data?.id ?? "",
      "provider starter transfer"
    );

    txHashes.transferStarter = transferReceipt.txHash;
  }

  const latestBlock = await publicClient.getBlock();
  const expiredAt = latestBlock.timestamp + BigInt(input.expiresInSeconds ?? 3600);

  const createJobTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.clientWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.agenticCommerce,
    abiFunctionSignature: "createJob(address,address,uint256,string,address)",
    abiParameters: [
      input.providerWalletAddress,
      input.clientWalletAddress,
      expiredAt.toString(),
      input.description,
      "0x0000000000000000000000000000000000000000"
    ],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });

  const createJobReceipt = await waitForCircleTransaction(
    circleClient,
    createJobTx.data?.id ?? "",
    "create job"
  );
  txHashes.createJob = createJobReceipt.txHash;

  const jobId = await extractJobId(createJobReceipt.txHash);
  const budget = parseUnits(input.budgetUsd.toString(), 6);

  const setBudgetTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.providerWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.agenticCommerce,
    abiFunctionSignature: "setBudget(uint256,uint256,bytes)",
    abiParameters: [jobId.toString(), budget.toString(), "0x"],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });
  txHashes.setBudget = (
    await waitForCircleTransaction(circleClient, setBudgetTx.data?.id ?? "", "set budget")
  ).txHash;

  const approveTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.clientWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.usdc,
    abiFunctionSignature: "approve(address,uint256)",
    abiParameters: [ARC_CONTRACTS.agenticCommerce, budget.toString()],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });
  txHashes.approve = (
    await waitForCircleTransaction(circleClient, approveTx.data?.id ?? "", "approve USDC")
  ).txHash;

  const fundTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.clientWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.agenticCommerce,
    abiFunctionSignature: "fund(uint256,bytes)",
    abiParameters: [jobId.toString(), "0x"],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });
  txHashes.fund = (
    await waitForCircleTransaction(circleClient, fundTx.data?.id ?? "", "fund job")
  ).txHash;

  const deliverableHash = keccak256(toHex(input.deliverableLabel ?? input.description));
  const submitTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.providerWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.agenticCommerce,
    abiFunctionSignature: "submit(uint256,bytes32,bytes)",
    abiParameters: [jobId.toString(), deliverableHash, "0x"],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });
  txHashes.submit = (
    await waitForCircleTransaction(circleClient, submitTx.data?.id ?? "", "submit deliverable")
  ).txHash;

  const completionReason = keccak256(toHex(input.completionReason ?? "deliverable-approved"));
  const completeTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.clientWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.agenticCommerce,
    abiFunctionSignature: "complete(uint256,bytes32,bytes)",
    abiParameters: [jobId.toString(), completionReason, "0x"],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });
  txHashes.complete = (
    await waitForCircleTransaction(circleClient, completeTx.data?.id ?? "", "complete job")
  ).txHash;

  const contract = getContract({
    address: ARC_CONTRACTS.agenticCommerce,
    abi: agenticCommerceAbi,
    client: publicClient
  });
  const job = await contract.read.getJob([jobId]);

  return {
    jobId: jobId.toString(),
    status: agenticCommerceStatusNames[Number(job.status)] ?? `Unknown(${job.status})`,
    budgetUsd: formatUnits(job.budget, 6),
    deliverableHash,
    txHashes
  };
}
