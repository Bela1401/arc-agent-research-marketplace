import { DemoConsole } from "@/components/judges/demo-console";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProjectSnapshot } from "@/lib/live-marketplace";
import { judgeNavItems, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Judge Demo Mode",
  description: "A clean, presentation-ready Arc demo flow with autopilot and proof links."
};

export default async function JudgesPage() {
  const snapshot = await getProjectSnapshot();
  const latestRun = snapshot.recentRuns.runs[0];

  return (
    <main className="app-shell">
      <SiteHeader
        navItems={[...judgeNavItems]}
        primaryAction={{ href: "/launch", label: "Open launcher" }}
        secondaryAction={{ href: "/", label: "Back to dashboard" }}
      />

      <section className="hero-surface" id="overview">
        <div className="hero-grid">
          <div>
            <span className="pill">Judge Mode</span>
            <h1>Run the whole Arc story without narrating every click.</h1>
            <p className="hero-copy">
              This page is tuned for the live presentation itself: open the dashboard, launch a fresh
              job, show the run appear in the live feed, and end on the premium report unlock.
            </p>

            <div className="link-row">
              <a className="button button--primary" href="#script">
                Start autopilot
              </a>
              <a className="button button--ghost" href="/">
                Open dashboard
              </a>
              <a className="button button--ghost" href="/submission">
                Submission kit
              </a>
            </div>
          </div>

          <aside className="hero-rail">
            <div className="metric-grid metric-grid--compact">
              <article className="metric-card">
                <span>Recent jobs</span>
                <strong>{snapshot.recentRuns.metrics.visibleRuns}</strong>
              </article>
              <article className="metric-card">
                <span>Visible tx links</span>
                <strong>{snapshot.recentRuns.metrics.txLinksVisible}</strong>
              </article>
              <article className="metric-card">
                <span>Premium unlock</span>
                <strong>{snapshot.premium.unlockPriceUsd.toFixed(3)} USDC</strong>
              </article>
              <article className="metric-card">
                <span>Latest run</span>
                <strong>{latestRun ? `#${latestRun.jobId}` : "n/a"}</strong>
              </article>
            </div>

            <div className="callout">
              <span className="pill pill--soft">Pitch framing</span>
              <p>
                Lead with the live feed, show one real browser-triggered run, then close on the
                premium layer and Arc transaction proof.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <div className="section-stack">
        <DemoConsole />

        <section className="surface" id="resources">
          <div className="section-head">
            <div>
              <span className="pill">Resources</span>
              <h2>Keep these tabs ready</h2>
              <p>These are the fastest supporting surfaces to open if judges ask for more proof or product depth.</p>
            </div>
          </div>

          <div className="launch-grid">
            <article className="launch-card">
              <span className="pill pill--soft">Dashboard</span>
              <h3>Live product surface</h3>
              <p>Recent Arc jobs, tx proof, premium rail, and economics in one place.</p>
              <div className="link-row">
                <a className="button button--primary" href="/">
                  Open dashboard
                </a>
              </div>
            </article>

            <article className="launch-card">
              <span className="pill pill--soft">Premium</span>
              <h3>Monetized report layer</h3>
              <p>Show the public teaser first and then the protected premium unlock endpoint.</p>
              <div className="link-row">
                <a className="button button--primary" href="/api/reports/teaser" rel="noreferrer" target="_blank">
                  Open teaser
                </a>
                <a className="button button--ghost" href="/api/reports/premium" rel="noreferrer" target="_blank">
                  Open premium
                </a>
              </div>
            </article>

            <article className="launch-card">
              <span className="pill pill--soft">Proof</span>
              <h3>Technical verification</h3>
              <p>Use API status, GitHub, and explorer-linked jobs if judges want implementation detail.</p>
              <div className="link-row">
                <a className="button button--primary" href="/api/arc/status" rel="noreferrer" target="_blank">
                  API status
                </a>
                <a className="button button--ghost" href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
                  GitHub
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
