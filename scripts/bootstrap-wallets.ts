import { bootstrapHackathonWallets } from "../lib/marketplace-integration";

async function main() {
  const result = await bootstrapHackathonWallets();

  console.log("\nArc hackathon wallets created successfully.");
  console.log(`Wallet set ID: ${result.walletSetId}`);

  for (const wallet of result.wallets) {
    console.log(`- ${wallet.role}: ${wallet.address} (${wallet.id})`);
  }

  console.log("\nAdd these lines to your .env.local:");
  console.log(result.envSnippet);
  console.log(
    "\nNext step: fund the validator and client wallets from the Circle Faucet, then run `npm run arc:register-agents`."
  );
}

main().catch((error) => {
  console.error("\nFailed to bootstrap hackathon wallets.");
  console.error(error);
  process.exit(1);
});
