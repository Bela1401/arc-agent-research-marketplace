import { z } from "zod";

function blankToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

const optionalAddressSchema = z.preprocess(
  blankToUndefined,
  z.string().startsWith("0x").optional()
);

const publicArcRpcUrlSchema = z.string().url().default("https://rpc.testnet.arc.network");

const serverEnvSchema = z.object({
  NEXT_PUBLIC_ARC_RPC_URL: publicArcRpcUrlSchema,
  CIRCLE_API_KEY: z.string().min(1),
  CIRCLE_ENTITY_SECRET: z.string().min(1),
  ARC_WALLET_SET_NAME: z.string().default("Arc Hackathon Wallets"),
  ARC_VALIDATOR_WALLET_ADDRESS: optionalAddressSchema,
  ARC_CLIENT_WALLET_ADDRESS: optionalAddressSchema,
  ARC_RESEARCH_WALLET_ADDRESS: optionalAddressSchema,
  ARC_FACT_CHECK_WALLET_ADDRESS: optionalAddressSchema,
  ARC_SUMMARY_WALLET_ADDRESS: optionalAddressSchema,
  ARC_RESEARCH_METADATA_URI: z.string().default("ipfs://arc-agent-research"),
  ARC_FACT_CHECK_METADATA_URI: z.string().default("ipfs://arc-agent-fact-check"),
  ARC_SUMMARY_METADATA_URI: z.string().default("ipfs://arc-agent-summary"),
  ARC_AGENT_REPUTATION_SCORE: z.coerce.number().int().min(0).max(100).default(95),
  ARC_PROVIDER_STARTER_BALANCE_USDC: z.coerce.number().positive().default(0.05),
  ARC_JOB_BUDGET_USDC: z.coerce.number().positive().max(0.01).default(0.008),
  ARC_REPORT_PRICE_USDC: z.coerce.number().positive().max(1).default(0.005),
  ARC_REPORT_SELLER_ADDRESS: optionalAddressSchema
});

export type ServerHackathonEnv = z.infer<typeof serverEnvSchema>;

export function getServerHackathonEnv(): ServerHackathonEnv {
  return serverEnvSchema.parse(process.env);
}

export function getArcRpcUrl(): string {
  return publicArcRpcUrlSchema.parse(process.env.NEXT_PUBLIC_ARC_RPC_URL);
}

export function getOptionalAddress(value: string | null | undefined): `0x${string}` | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed as `0x${string}`;
}
