import {
  runConfiguredMarketplaceJob,
  type MarketplaceProviderRole
} from "../lib/marketplace-integration";

const providerRole = (process.argv[2] as MarketplaceProviderRole | undefined) ?? "research";
const description = process.argv.slice(3).join(" ").trim() || undefined;

async function main() {
  const result = await runConfiguredMarketplaceJob(providerRole, description);

  console.log("\nERC-8183 job completed.");
  console.log(`Job ID: ${result.jobId}`);
  console.log(`Status: ${result.status}`);
  console.log(`Budget: ${result.budgetUsd} USDC`);
  console.log(`Deliverable hash: ${result.deliverableHash}`);

  if (result.txHashes.transferStarter) {
    console.log(`Starter transfer tx: ${result.txHashes.transferStarter}`);
  }

  console.log(`Create job tx: ${result.txHashes.createJob}`);
  console.log(`Set budget tx: ${result.txHashes.setBudget}`);
  console.log(`Approve tx: ${result.txHashes.approve}`);
  console.log(`Fund tx: ${result.txHashes.fund}`);
  console.log(`Submit tx: ${result.txHashes.submit}`);
  console.log(`Complete tx: ${result.txHashes.complete}`);
}

main().catch((error) => {
  console.error("\nFailed to execute ERC-8183 marketplace job.");
  console.error(error);
  process.exit(1);
});
