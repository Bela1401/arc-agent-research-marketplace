import { hackathonTargets } from "@/lib/arc";
import { liveArcProof } from "@/lib/live-proof";
import { usd } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export function Hero() {
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
          </div>
        </div>

        <div className="hero-console">
          <div className="hero-console__header">
            <span className="eyebrow">Live operator view</span>
            <strong>Production demo ready</strong>
          </div>

          <div className="hero-stats">
            <div>
              <span>Live jobs proved</span>
              <strong>{liveArcProof.stats.completedJobs}</strong>
            </div>
            <div>
              <span>ERC-8183 tx</span>
              <strong>{liveArcProof.stats.erc8183Transactions}</strong>
            </div>
            <div>
              <span>Per action target</span>
              <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
            </div>
            <div>
              <span>Settlement asset</span>
              <strong>USDC</strong>
            </div>
          </div>

          <div className="hero-console__feed">
            <div>
              <span>Latest live milestone</span>
              <strong>Browser-triggered jobs completed on Vercel</strong>
            </div>
            <div>
              <span>What judges can do</span>
              <strong>Open launcher, trigger job, inspect proof</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
