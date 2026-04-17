import { NextResponse } from "next/server";
import { ARC_CONTRACTS, arcTestnet } from "@/lib/arc";
import { getPremiumReportSummary } from "@/lib/live-marketplace";
import { getConfiguredIntegrationStatus } from "@/lib/marketplace-integration";

export async function GET() {
  const premium = await getPremiumReportSummary();

  return NextResponse.json({
    network: {
      name: arcTestnet.name,
      chainId: arcTestnet.id,
      rpcUrl: arcTestnet.rpcUrls.default.http[0],
      explorerUrl: arcTestnet.blockExplorers.default.url
    },
    contracts: ARC_CONTRACTS,
    integration: getConfiguredIntegrationStatus(),
    premiumReport: {
      endpointPath: premium.endpointPath,
      teaserPath: premium.teaserPath,
      unlockPriceUsd: premium.unlockPriceUsd,
      sellerAddress: premium.sellerAddress,
      paymentRail: premium.paymentRail
    }
  });
}
