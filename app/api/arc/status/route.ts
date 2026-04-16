import { NextResponse } from "next/server";
import { ARC_CONTRACTS, arcTestnet } from "@/lib/arc";
import { getConfiguredIntegrationStatus } from "@/lib/marketplace-integration";

export async function GET() {
  return NextResponse.json({
    network: {
      name: arcTestnet.name,
      chainId: arcTestnet.id,
      rpcUrl: arcTestnet.rpcUrls.default.http[0],
      explorerUrl: arcTestnet.blockExplorers.default.url
    },
    contracts: ARC_CONTRACTS,
    integration: getConfiguredIntegrationStatus()
  });
}
