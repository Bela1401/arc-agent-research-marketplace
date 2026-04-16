import { buildExplorerUrl } from "@/lib/arc";

interface LiveProofWallet {
  role: string;
  purpose: string;
  address: `0x${string}`;
}

interface LiveProofTx {
  label: string;
  hash: `0x${string}`;
  explorerUrl: string;
}

interface LiveProofJob {
  id: number;
  role: "research" | "factCheck" | "summary";
  providerName: string;
  providerWallet: `0x${string}`;
  budgetUsd: number;
  deliverableHash: `0x${string}`;
  transactions: LiveProofTx[];
}

function tx(label: string, hash: `0x${string}`): LiveProofTx {
  return {
    label,
    hash,
    explorerUrl: buildExplorerUrl(hash)
  };
}

const wallets: LiveProofWallet[] = [
  {
    role: "validator",
    purpose: "Writes reputation and validation updates for provider agents.",
    address: "0xa4aa94fc27fdd2be9b14af4931bafe44bb3beb66"
  },
  {
    role: "client",
    purpose: "Funds marketplace jobs and pays the specialist providers.",
    address: "0xff29df9f221e345ce668370740fac7c1005c6bf7"
  },
  {
    role: "research",
    purpose: "Handles source discovery and research-heavy subtasks.",
    address: "0x53739a4e2d5be733f3b084c3720f1f5bc7739613"
  },
  {
    role: "fact-check",
    purpose: "Verifies claims, evidence, and source consistency.",
    address: "0x6ceb109073f2ffbb28151fd100d4684e0e13c0ea"
  },
  {
    role: "summary",
    purpose: "Produces the final synthesis and decision-ready report.",
    address: "0x01d761b8f18fc4e723ebc9fed376e1a14a97dab8"
  }
];

const jobs: LiveProofJob[] = [
  {
    id: 3437,
    role: "research",
    providerName: "Signal Scout",
    providerWallet: "0x53739a4e2d5be733f3b084c3720f1f5bc7739613",
    budgetUsd: 0.008,
    deliverableHash: "0x66cf7710003ef8a8a3103c74255520cd4cf0969a8ea2dce6c4f83768bdb29837",
    transactions: [
      tx("Create job", "0x6641dca54f993ab3f6e76c25cbc99b6ee8d01d1ad40032288966ff2954e5f404"),
      tx("Set budget", "0x9506f14a0a075e2d0939a0a45cdf0c928f8a50605a71a40e89f4e8e1643a518"),
      tx("Approve USDC", "0xa94f58cd86717cb1401ddea80e155d6ef59906660184769ed0301fa1e9780a2c"),
      tx("Fund job", "0x292e5ff9ca72fba18e3ef69db06bf39b4302c0aa3af018766d90831267d00561"),
      tx("Submit deliverable", "0x34f653fb347c2183889fd8e888e969862c8ff7b892edc12daf9e417ee6173031"),
      tx("Complete settlement", "0x5bfcefcd520a8adac18b7c0ba0ae73474ad894f6965fe5efc1ac2c059ccb6756")
    ]
  },
  {
    id: 3438,
    role: "factCheck",
    providerName: "Proof Engine",
    providerWallet: "0x6ceb109073f2ffbb28151fd100d4684e0e13c0ea",
    budgetUsd: 0.008,
    deliverableHash: "0xd33f657c7e6737a871628372e4aa46c20c907ec294c47a31da94d134fc3c41a1",
    transactions: [
      tx("Create job", "0xf50e10615fa299643ba0927f91fbc57c08dff6ad6a36ec267d29c40086bb3095"),
      tx("Set budget", "0x58133a2f50af59f11a0392cf2346efe134dcc482885ca2e63fce567bb5fff45f"),
      tx("Approve USDC", "0xa337777b3528360316692df6e8a75dc1cab85389fc8826c6513798c488081f84"),
      tx("Submit deliverable", "0xf2d1edf52e7d14fd0d36f9d301b33b420d92663f6f1ead42aa916dfa67d913e2")
    ]
  },
  {
    id: 3439,
    role: "summary",
    providerName: "Brief Forge",
    providerWallet: "0x01d761b8f18fc4e723ebc9fed376e1a14a97dab8",
    budgetUsd: 0.008,
    deliverableHash: "0x78c315e8bb288a08614cba7d0434c62d8da80ddce7260e36635eedd7d5b565ac",
    transactions: [
      tx("Create job", "0x1f1706a5bbe4a7f8dbf6149bea26a8c0316792f5f4830c34993309e5210875a6"),
      tx("Set budget", "0x63aa56d3a76806d3f1c3eee35df2a7612f6265c2d2559e2cf596e831bb070377"),
      tx("Approve USDC", "0x2a23e4ef818063880113880e6c3c95766c91f4b59db9590b249b5345a5bdbbf3"),
      tx("Submit deliverable", "0x7da64c0ac3f9f52dfd1a7340058c7147d112fb485d5e9cb6ba0b3b725d80e7b6")
    ]
  }
];

export const liveArcProof = {
  capturedAt: "2026-04-16",
  walletSetId: "a0c3f6a3-512e-5b7a-955a-257c73506066",
  registeredAgents: 3,
  registeredAgentNote:
    "The provider agents were registered through the ERC-8004 flow, including validator feedback and validation writes.",
  summaryAgentId: 2100,
  summaryValidationTag: "summary_verified",
  wallets,
  jobs,
  stats: {
    completedJobs: jobs.length,
    liveWallets: wallets.length,
    erc8183Transactions: 21,
    averageBudgetUsd: jobs.reduce((sum, job) => sum + job.budgetUsd, 0) / jobs.length
  }
} as const;

export type LiveArcProof = typeof liveArcProof;
