import { shortHash, usd } from "@/lib/format";
import type { PremiumReportSummary } from "@/lib/live-marketplace";

interface PremiumAccessPanelProps {
  summary: PremiumReportSummary;
}

export function PremiumAccessPanel({ summary }: PremiumAccessPanelProps) {
  return (
    <section className="panel panel--highlight" id="premium">
      <div className="section-heading">
        <div>
          <h2>Premium report unlock</h2>
          <p>
            The report layer is no longer just a feature list. The full export now lives behind a
            real x402 paywall, so other agents or operators can pay per unlock instead of buying a
            seat or subscription.
          </p>
        </div>
        <span className="eyebrow">Nanopayments ready</span>
      </div>

      <div className="premium-grid">
        <article className="premium-card">
          <span>Unlock price</span>
          <strong>{usd(summary.unlockPriceUsd)}</strong>
          <p>Every premium access request can settle independently on Arc Testnet.</p>
        </article>

        <article className="premium-card">
          <span>Seller wallet</span>
          <strong>{shortHash(summary.sellerAddress)}</strong>
          <p>
            <a href={summary.sellerExplorerUrl} rel="noreferrer" target="_blank">
              Open seller wallet on explorer
            </a>
          </p>
        </article>

        <article className="premium-card">
          <span>Payment rail</span>
          <strong>{summary.paymentRail}</strong>
          <p>{summary.summary}</p>
        </article>
      </div>

      <div className="project-brief">
        <div>
          <span className="eyebrow">Protected endpoint</span>
          <code>{summary.endpointPath}</code>
          <p>
            Unpaid requests receive an x402 payment challenge. Paid requests unlock the full report
            JSON with monetization math and recent Arc evidence.
          </p>
        </div>
        <div>
          <span className="eyebrow">Free teaser</span>
          <code>{summary.teaserPath}</code>
          <p>The teaser stays public so judges can see the product surface before the paid unlock.</p>
        </div>
      </div>

      <div className="premium-highlights">
        {summary.highlights.map((highlight) => (
          <article className="stack-card" key={highlight}>
            <p>{highlight}</p>
          </article>
        ))}
      </div>

      <div className="command-footer">
        <div className="command-footer__item">
          <span className="eyebrow">Judge path</span>
          <p>Open the teaser first, then hit the protected route and show the x402 payment challenge.</p>
        </div>
        <div className="command-footer__actions">
          <a className="button button--primary" href={summary.endpointPath} target="_blank" rel="noreferrer">
            Open x402 paywall
          </a>
          <a className="button button--ghost" href={summary.teaserPath} target="_blank" rel="noreferrer">
            View teaser JSON
          </a>
        </div>
      </div>
    </section>
  );
}
