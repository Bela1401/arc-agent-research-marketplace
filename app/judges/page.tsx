import { JudgeDemoPanel } from "@/components/judge-demo-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getMarginCalculatorSeed,
  getPremiumReportSummary,
  getRecentRunsSummary
} from "@/lib/live-marketplace";
import { judgeNavItems, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Judge Demo Mode",
  description: "A one-click presentation script for the Arc Agent Research Marketplace hackathon demo."
};

export default async function JudgesPage() {
  const recentRuns = await getRecentRunsSummary();
  const premium = await getPremiumReportSummary(recentRuns);
  const margin = await getMarginCalculatorSeed(recentRuns, premium);

  return (
    <main className="page-shell">
      <SiteHeader
        navItems={[...judgeNavItems]}
        primaryAction={{ href: "/launch", label: "Open launcher" }}
        secondaryAction={{ href: "/", label: "Back to homepage" }}
      />

      <section className="hero-panel">
        <div className="hero-layout">
          <div>
            <div className="eyebrow">Judge-ready mode</div>
            <h1>Pitch the whole product without narrating every click.</h1>
            <p className="lede">
              This surface is tuned for the hackathon presentation itself. It turns {siteConfig.name}
              into a guided flow: open the proof, run a fresh job, watch it land in the live feed,
              and end on the premium x402 monetization layer.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="#script">
                Start demo script
              </a>
              <a className="button button--ghost" href="/#recent">
                Open live homepage feed
              </a>
              <a className="button button--ghost" href="/submission">
                Open submission kit
              </a>
            </div>

            <div className="hero-trust">
              <span>Judge-focused flow</span>
              <span>One-click launch step</span>
              <span>Fallback tabs ready</span>
              <span>Live Arc proof</span>
            </div>
          </div>

          <div className="hero-console">
            <div className="hero-console__header">
              <span className="eyebrow">Pitch snapshot</span>
              <strong>Built for live judging</strong>
            </div>

            <div className="hero-stats">
              <div>
                <span>Recent live jobs</span>
                <strong>{recentRuns.metrics.visibleRuns}</strong>
              </div>
              <div>
                <span>Latest job</span>
                <strong>#{recentRuns.runs[0]?.jobId ?? "n/a"}</strong>
              </div>
              <div>
                <span>Premium unlock</span>
                <strong>{premium.unlockPriceUsd.toFixed(3)} USDC</strong>
              </div>
              <div>
                <span>Break-even unlocks</span>
                <strong>{margin.breakEvenUnlocks}</strong>
              </div>
            </div>

            <div className="hero-console__feed">
              <div>
                <span>Recommended story</span>
                <strong>Live job creation plus premium resale is the strongest wow moment.</strong>
              </div>
              <div>
                <span>Judge fallback</span>
                <strong>If a live run is slow, jump straight to teaser, paywall, and recent Arc proofs.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <JudgeDemoPanel />

      <section className="panel" id="flow">
        <div className="section-heading">
          <div>
            <h2>Live flow map</h2>
            <p>
              This is the ideal path in front of judges: start broad, create something live, then
              end on why the business model matters.
            </p>
          </div>
          <span className="eyebrow">Recommended order</span>
        </div>

        <div className="flow-grid">
          <article className="flow-card">
            <span className="flow-card__index">01</span>
            <h3>Show live proof first</h3>
            <p>The homepage already proves this is not a static landing page or a mock dashboard.</p>
          </article>
          <article className="flow-card">
            <span className="flow-card__index">02</span>
            <h3>Trigger a fresh job</h3>
            <p>Use the one-click run step so judges see a new Arc job start from the browser itself.</p>
          </article>
          <article className="flow-card">
            <span className="flow-card__index">03</span>
            <h3>Refresh recent runs</h3>
            <p>Show the new job landing back on the homepage and becoming part of the live product surface.</p>
          </article>
          <article className="flow-card">
            <span className="flow-card__index">04</span>
            <h3>Close on monetization</h3>
            <p>The premium x402 layer makes the report resellable, which pushes the story beyond a one-off demo.</p>
          </article>
        </div>
      </section>

      <section className="panel panel--highlight" id="fallback">
        <div className="section-heading">
          <div>
            <h2>Fallback plan</h2>
            <p>
              If the live chain or a browser tab is slow, the demo should still stay strong. These
              are the fastest branches to take without losing credibility.
            </p>
          </div>
          <span className="eyebrow">Pitch safety net</span>
        </div>

        <div className="project-brief project-brief--stack">
          <div className="stack-card">
            <span className="eyebrow">If live job is slow</span>
            <p>Open the teaser first, then open the premium paywall, then jump back to recent runs after the page catches up.</p>
          </div>
          <div className="stack-card">
            <span className="eyebrow">If judges ask for proof</span>
            <p>Open `/api/arc/status`, the live homepage feed, and the tx links already visible inside recent runs.</p>
          </div>
          <div className="stack-card">
            <span className="eyebrow">If judges ask for code</span>
            <p>Open GitHub and point to the live feed, premium x402 endpoint, and browser launcher as three separate shipped surfaces.</p>
          </div>
        </div>
      </section>

      <section className="panel" id="assets">
        <div className="section-heading">
          <div>
            <h2>Rapid-access assets</h2>
            <p>Keep these tabs ready in case the judges want to drill deeper without breaking presentation flow.</p>
          </div>
          <span className="eyebrow">Open in new tab</span>
        </div>

        <div className="command-grid">
          <article className="command-card">
            <span className="eyebrow">Homepage</span>
            <h3>Live product surface</h3>
            <p>Recent runs, premium unlock panel, margin calculator, and technical proof in one place.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href="/" target="_blank" rel="noreferrer">
                Open homepage
              </a>
            </div>
          </article>

          <article className="command-card">
            <span className="eyebrow">Premium</span>
            <h3>Monetized report layer</h3>
            <p>Show the free teaser and the protected x402 paywall as a real resale path.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href="/api/reports/teaser" target="_blank" rel="noreferrer">
                Open teaser
              </a>
              <a className="button button--ghost" href="/api/reports/premium" target="_blank" rel="noreferrer">
                Open paywall
              </a>
            </div>
          </article>

          <article className="command-card">
            <span className="eyebrow">Technical</span>
            <h3>Operator proof</h3>
            <p>Use API status and GitHub when judges want to verify that the flow is live and shipped.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href="/api/arc/status" target="_blank" rel="noreferrer">
                API status
              </a>
              <a className="button button--ghost" href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
                Open GitHub
              </a>
            </div>
          </article>

          <article className="command-card">
            <span className="eyebrow">Submission</span>
            <h3>Copy-ready hackathon pack</h3>
            <p>Short description, long description, video order, and checklist are bundled on one page.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href="/submission">
                Open submission kit
              </a>
            </div>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
