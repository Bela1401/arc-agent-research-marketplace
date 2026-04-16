import { getContract, keccak256, parseAbiItem, toHex } from "viem";
import {
  ARC_CONTRACTS,
  identityRegistryReadAbi,
  validationRegistryReadAbi
} from "@/lib/arc";
import {
  getArcBlockchainName,
  getArcPublicClient,
  getCircleClient,
  waitForCircleTransaction
} from "@/lib/circle";

type Address = `0x${string}`;

export interface RegisterArcAgentInput {
  agentWalletAddress: Address;
  validatorWalletAddress: Address;
  metadataUri: string;
  reputationScore: number;
  reputationTag: string;
  validationTag: string;
  validationRequestUri?: string;
}

export interface RegisterArcAgentResult {
  agentWalletAddress: Address;
  agentId: string;
  metadataUri: string;
  owner: Address;
  validationTag: string;
  txHashes: {
    register: string;
    reputation: string;
    validationRequest: string;
    validationResponse: string;
  };
}

export async function registerArcAgent(
  input: RegisterArcAgentInput
): Promise<RegisterArcAgentResult> {
  const circleClient = getCircleClient();
  const publicClient = getArcPublicClient();

  const registerTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.agentWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.identityRegistry,
    abiFunctionSignature: "register(string)",
    abiParameters: [input.metadataUri],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });

  const registerReceipt = await waitForCircleTransaction(
    circleClient,
    registerTx.data?.id ?? "",
    "agent identity registration"
  );

  const latestBlock = await publicClient.getBlockNumber();
  const blockRange = 10_000n;
  const fromBlock = latestBlock > blockRange ? latestBlock - blockRange : 0n;
  const transferLogs = await publicClient.getLogs({
    address: ARC_CONTRACTS.identityRegistry,
    event: parseAbiItem(
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
    ),
    args: { to: input.agentWalletAddress },
    fromBlock,
    toBlock: latestBlock
  });

  if (transferLogs.length === 0) {
    throw new Error("No Transfer events found for registered agent");
  }

  const agentId = transferLogs[transferLogs.length - 1].args.tokenId?.toString();

  if (!agentId) {
    throw new Error("Could not determine agentId from registration logs");
  }

  const tagHash = keccak256(toHex(input.reputationTag));
  const reputationTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.validatorWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.reputationRegistry,
    abiFunctionSignature:
      "giveFeedback(uint256,int128,uint8,string,string,string,string,bytes32)",
    abiParameters: [
      agentId,
      input.reputationScore.toString(),
      "0",
      input.reputationTag,
      "",
      "",
      "",
      tagHash
    ],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });

  const reputationReceipt = await waitForCircleTransaction(
    circleClient,
    reputationTx.data?.id ?? "",
    "agent reputation feedback"
  );

  const requestHash = keccak256(toHex(`validation_request_${agentId}_${input.validationTag}`));
  const validationRequestTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.agentWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.validationRegistry,
    abiFunctionSignature: "validationRequest(address,uint256,string,bytes32)",
    abiParameters: [
      input.validatorWalletAddress,
      agentId,
      input.validationRequestUri ?? input.metadataUri,
      requestHash
    ],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });

  const validationRequestReceipt = await waitForCircleTransaction(
    circleClient,
    validationRequestTx.data?.id ?? "",
    "validation request"
  );

  const validationResponseTx = await circleClient.createContractExecutionTransaction({
    walletAddress: input.validatorWalletAddress,
    blockchain: getArcBlockchainName(),
    contractAddress: ARC_CONTRACTS.validationRegistry,
    abiFunctionSignature: "validationResponse(bytes32,uint8,string,bytes32,string)",
    abiParameters: [requestHash, "100", "", "0x" + "0".repeat(64), input.validationTag],
    fee: { type: "level", config: { feeLevel: "MEDIUM" } }
  });

  const validationResponseReceipt = await waitForCircleTransaction(
    circleClient,
    validationResponseTx.data?.id ?? "",
    "validation response"
  );

  const identityContract = getContract({
    address: ARC_CONTRACTS.identityRegistry,
    abi: identityRegistryReadAbi,
    client: publicClient
  });

  const validationContract = getContract({
    address: ARC_CONTRACTS.validationRegistry,
    abi: validationRegistryReadAbi,
    client: publicClient
  });

  const owner = await identityContract.read.ownerOf([BigInt(agentId)]);
  const tokenUri = await identityContract.read.tokenURI([BigInt(agentId)]);
  await validationContract.read.getValidationStatus([requestHash]);

  return {
    agentWalletAddress: input.agentWalletAddress,
    agentId,
    metadataUri: tokenUri,
    owner,
    validationTag: input.validationTag,
    txHashes: {
      register: registerReceipt.txHash,
      reputation: reputationReceipt.txHash,
      validationRequest: validationRequestReceipt.txHash,
      validationResponse: validationResponseReceipt.txHash
    }
  };
}
