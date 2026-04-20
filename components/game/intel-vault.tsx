import { arcTestnet, hackathonTargets } from "@/lib/arc";
import { shortHash, usd } from "@/lib/format";
import type { MarginCalculatorSeed, PremiumReportSummary } from "@/lib/live-marketplace";

interface IntelVaultProps {
  premium: PremiumReportSummary;
  margin: MarginCalculatorSeed;
}

export function IntelVault({ premium, margin }: IntelVaultProps) {
  const estimatedMissionCost = margin.averageArcLegUsd * margin.defaultLegs;

  return (
    <section className="game-panel" id="vault">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Intel Vault</span>
          <h2>Turn a cleared run into paid inventory</h2>
          <p>
            The mission does not end when the tx clears. The finished output can be resold through a
            premium x402 unlock, which is the strongest business moment in the demo.
          </p>
        </div>
      </div>

      <div className="vault-grid">
        <article className="vault-card">
          <span>Vault key</span>
          <strong>{usd(premium.unlockPriceUsd)}</strong>
          <p>Price to unlock the full report from the premium endpoint.</p>
        </article>
        <article className="vault-card">
          <span>Mission loop cost</span>
          <strong>{usd(estimatedMissionCost)}</strong>
          <p>Estimated cost for a three-step Arc mission loop at the current average leg price.</p>
        </article>
        <article className="vault-card">
          <span>Break-even</span>
          <strong>{margin.breakEvenUnlocks} unlocks</strong>
          <p>Approximate paid unlocks needed before the report becomes margin-positive.</p>
        </article>
      </div>

      <div className="vault-callout">
        <div>
          <span className="eyebrow eyebrow--soft">Why Arc wins</span>
          <p>
            Arc keeps per-action settlement close to the hackathon target of{" "}
            <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>, so the unlock economics do
            not collapse under gas overhead.
          </p>
        </div>
        <div className="vault-callout__meta">
          <span>{premium.paymentRail}</span>
          <span>{arcTestnet.name}</span>
          <span>{shortHash(premium.sellerAddress)}</span>
        </div>
      </div>

      <div className="button-row">
        <a className="button button--primary" href={premium.teaserPath} rel="noreferrer" target="_blank">
          Open teaser
        </a>
        <a className="button button--ghost" href={premium.endpointPath} rel="noreferrer" target="_blank">
          Open premium vault
        </a>
        <a className="button button--ghost" href={premium.sellerExplorerUrl} rel="noreferrer" target="_blank">
          Seller wallet
        </a>
      </div>
    </section>
  );
}
