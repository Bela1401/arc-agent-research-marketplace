import { AgentRegistry } from "@/components/agent-registry";
import { CommandCenter } from "@/components/command-center";
import { Hero } from "@/components/hero";
import { IntegrationReadiness } from "@/components/integration-readiness";
import { LiveProofPanel } from "@/components/live-proof";
import { MarginCalculator } from "@/components/margin-calculator";
import { MarketplaceFlow } from "@/components/marketplace-flow";
import { PremiumAccessPanel } from "@/components/premium-access";
import { RecentRuns } from "@/components/recent-runs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getAgentRegistryEntries,
  getMarginCalculatorSeed,
  getPremiumReportSummary,
  getRecentRunsSummary
} from "@/lib/live-marketplace";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const focusJobParam = resolvedSearchParams.focusJob;
  const focusJobId = Array.isArray(focusJobParam) ? focusJobParam[0] : focusJobParam;
  const recentRuns = await getRecentRunsSummary();
  const [premiumReportSummary, marginSeed] = await Promise.all([
    getPremiumReportSummary(recentRuns),
    getMarginCalculatorSeed(recentRuns)
  ]);
  const agents = getAgentRegistryEntries();

  return (
    <main className="page-shell">
      <SiteHeader />
      <Hero
        latestJobId={recentRuns.runs[0]?.jobId}
        premiumUnlockPriceUsd={premiumReportSummary.unlockPriceUsd}
        recentRunsCount={recentRuns.metrics.visibleRuns}
        txLinksVisible={recentRuns.metrics.txLinksVisible}
      />
      <CommandCenter />
      <RecentRuns focusJobId={focusJobId} summary={recentRuns} />
      <div className="split-layout">
        <PremiumAccessPanel summary={premiumReportSummary} />
        <MarginCalculator seed={marginSeed} />
      </div>
      <div id="proof">
        <LiveProofPanel />
      </div>
      <MarketplaceFlow />
      <AgentRegistry agents={agents} />
      <div id="stack">
        <IntegrationReadiness />
      </div>
      <SiteFooter />
    </main>
  );
}
