import { hackathonTargets } from "@/lib/arc";
import { liveArcProof } from "@/lib/live-proof";
import { usd } from "@/lib/format";

export function Hero() {
  return (
    <section className="hero-panel">
      <div className="eyebrow">Arc Hackathon MVP</div>
      <h1>Agent-to-Agent Research Marketplace</h1>
      <p className="lede">
        A manager agent decomposes a research brief into paid microtasks, specialist agents
        execute the work, and every step settles in USDC on Arc.
      </p>
      <div className="hero-stats">
        <div>
          <span>Live jobs proved</span>
          <strong>{liveArcProof.stats.completedJobs}</strong>
        </div>
        <div>
          <span>Live ERC-8183 tx</span>
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
    </section>
  );
}
