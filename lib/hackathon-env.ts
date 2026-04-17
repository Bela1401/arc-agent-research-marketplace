import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_ARC_RPC_URL: z.string().url().default("https://rpc.testnet.arc.network"),
  CIRCLE_API_KEY: z.string().min(1),
  CIRCLE_ENTITY_SECRET: z.string().min(1),
  ARC_WALLET_SET_NAME: z.string().default("Arc Hackathon Wallets"),
  ARC_VALIDATOR_WALLET_ADDRESS: z.string().startsWith("0x").optional(),
  ARC_CLIENT_WALLET_ADDRESS: z.string().startsWith("0x").optional(),
  ARC_RESEARCH_WALLET_ADDRESS: z.string().startsWith("0x").optional(),
  ARC_FACT_CHECK_WALLET_ADDRESS: z.string().startsWith("0x").optional(),
  ARC_SUMMARY_WALLET_ADDRESS: z.string().startsWith("0x").optional(),
  ARC_RESEARCH_METADATA_URI: z.string().default("ipfs://arc-agent-research"),
  ARC_FACT_CHECK_METADATA_URI: z.string().default("ipfs://arc-agent-fact-check"),
  ARC_SUMMARY_METADATA_URI: z.string().default("ipfs://arc-agent-summary"),
  ARC_AGENT_REPUTATION_SCORE: z.coerce.number().int().min(0).max(100).default(95),
  ARC_PROVIDER_STARTER_BALANCE_USDC: z.coerce.number().positive().default(0.05),
  ARC_JOB_BUDGET_USDC: z.coerce.number().positive().max(0.01).default(0.008),
  ARC_REPORT_PRICE_USDC: z.coerce.number().positive().max(1).default(0.005),
  ARC_REPORT_SELLER_ADDRESS: z.string().startsWith("0x").optional()
});

export type ServerHackathonEnv = z.infer<typeof serverEnvSchema>;

export function getServerHackathonEnv(): ServerHackathonEnv {
  return serverEnvSchema.parse(process.env);
}
