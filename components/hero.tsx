import { hackathonTargets } from "@/lib/arc";
import { usd } from "@/lib/format";
import { siteConfig } from "@/lib/site";

interface HeroProps {
  recentRunsCount: number;
  txLinksVisible: number;
  premiumUnlockPriceUsd: number;
  latestJobId?: string;
}

export function Hero({
  recentRunsCount,
  txLinksVisible,
  premiumUnlockPriceUsd,
  latestJobId
}: HeroProps) {
  return (
    <section className="hero-panel">
      <div className="hero-layout">
        <div>
          <div className="eyebrow">Arc Hackathon MVP</div>
          <h1>Agentic work deserves a real payment rail.</h1>
          <p className="lede">
            {siteConfig.name} turns one research prompt into specialist jobs, pays each provider in
            USDC, and proves the lifecycle on Arc with explorer-ready settlement links.
          </p>

          <div className="hero-actions">
            <a className="button button--primary" href="/launch">
              Launch live job
            </a>
            <a className="button button--ghost" href="#proof">
              View live proof
            </a>
            <a className="button button--ghost" href="/api/arc/status" target="_blank" rel="noreferrer">
              API status
            </a>
          </div>

          <div className="hero-trust">
            <span>Circle wallets</span>
            <span>ERC-8004 identity</span>
            <span>ERC-8183 settlement</span>
            <span>Browser launch flow</span>
            <span>x402 premium unlocks</span>
          </div>
        </div>

        <div className="hero-console">
          <div className="hero-console__header">
            <span className="eyebrow">Live operator view</span>
            <strong>Production demo ready</strong>
          </div>

          <div className="hero-stats">
            <div>
              <span>Recent live jobs</span>
              <strong>{recentRunsCount}</strong>
            </div>
            <div>
              <span>Tx links visible</span>
              <strong>{txLinksVisible}</strong>
            </div>
            <div>
              <span>Per action target</span>
              <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
            </div>
            <div>
              <span>Premium unlock</span>
              <strong>{usd(premiumUnlockPriceUsd)}</strong>
            </div>
          </div>

          <div className="hero-console__feed">
            <div>
              <span>Latest live milestone</span>
              <strong>
                {latestJobId
                  ? `Job #${latestJobId} is already visible on the homepage with live Arc proof`
                  : "Browser-triggered jobs completed on Vercel"}
              </strong>
            </div>
            <div>
              <span>What judges can do</span>
              <strong>Open launcher, trigger job, inspect proof, then hit the x402 premium layer</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
