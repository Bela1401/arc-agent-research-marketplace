import {
  type MarketplaceProviderRole,
  registerConfiguredMarketplaceAgents
} from "../lib/marketplace-integration";

const requestedRoles = process.argv.slice(2) as MarketplaceProviderRole[];
const roles =
  requestedRoles.length > 0 ? requestedRoles : (["research", "factCheck", "summary"] as const);

async function main() {
  const result = await registerConfiguredMarketplaceAgents([...roles]);

  console.log("\nMarketplace agents registered on Arc.");

  for (const agent of result) {
    console.log(`\nAgent wallet: ${agent.agentWalletAddress}`);
    console.log(`Agent ID: ${agent.agentId}`);
    console.log(`Owner: ${agent.owner}`);
    console.log(`Metadata: ${agent.metadataUri}`);
    console.log(`Validation tag: ${agent.validationTag}`);
    console.log(`Register tx: ${agent.txHashes.register}`);
    console.log(`Reputation tx: ${agent.txHashes.reputation}`);
    console.log(`Validation request tx: ${agent.txHashes.validationRequest}`);
    console.log(`Validation response tx: ${agent.txHashes.validationResponse}`);
  }
}

main().catch((error) => {
  console.error("\nFailed to register marketplace agents.");
  console.error(error);
  process.exit(1);
});
