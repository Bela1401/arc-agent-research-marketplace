import { DemoConsole } from "@/components/judges/demo-console";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getProjectSnapshot } from "@/lib/live-marketplace";
import { judgeNavItems, siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arc Ops Judge Speedrun",
  description: "A one-click judge path for the playable Arc mission-control demo."
};

export default async function JudgesPage() {
  const snapshot = await getProjectSnapshot();
  const latestRun = snapshot.recentRuns.runs[0];

  return (
    <main className="app-shell">
      <SiteHeader
        navItems={[...judgeNavItems]}
        primaryAction={{ href: "/", label: "Open Arc Ops" }}
        secondaryAction={{ href: "/launch", label: "Manual console" }}
      />

      <section className="hero-board hero-board--judge">
        <div className="hero-board__content">
          <span className="eyebrow">Judge Speedrun</span>
          <h1>Show the whole Arc loop in one run.</h1>
          <p className="hero-copy">
            This route is built for judging: clear one live mission, open its replay trail, and end
            on the premium vault plus proof rails.
          </p>

          <div className="button-row">
            <a className="button button--primary" href="#speedrun">
              Start speedrun
            </a>
            <a className="button button--ghost" href="/submission">
              Submission kit
            </a>
          </div>
        </div>

        <aside className="hero-hud">
          <div className="score-grid">
            <article className="score-card">
              <span>Live missions</span>
              <strong>{snapshot.recentRuns.metrics.visibleRuns}</strong>
            </article>
            <article className="score-card">
              <span>Replay links</span>
              <strong>{snapshot.recentRuns.metrics.txLinksVisible}</strong>
            </article>
            <article className="score-card">
              <span>Vault key</span>
              <strong>{snapshot.premium.unlockPriceUsd.toFixed(3)} USDC</strong>
            </article>
            <article className="score-card">
              <span>Latest mission</span>
              <strong>{latestRun ? `#${latestRun.jobId}` : "n/a"}</strong>
            </article>
          </div>
        </aside>
      </section>

      <div className="arena-stack">
        <DemoConsole />

        <section className="game-panel" id="proof">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Proof rails</span>
              <h2>Keep these tabs ready</h2>
              <p>Open these if judges ask for implementation detail or verification depth.</p>
            </div>
          </div>

          <div className="mission-grid">
            <article className="mission-card mission-card--static">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Game</span>
              </div>
              <h3>Arc Ops</h3>
              <p>Live mission board with replay logs and vault access.</p>
              <div className="button-row">
                <a className="button button--primary" href="/">
                  Open game
                </a>
              </div>
            </article>

            <article className="mission-card mission-card--static">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Vault</span>
              </div>
              <h3>Premium endpoints</h3>
              <p>Show the teaser first, then the full premium unlock challenge.</p>
              <div className="button-row">
                <a className="button button--primary" href="/api/reports/teaser" rel="noreferrer" target="_blank">
                  Open teaser
                </a>
                <a className="button button--ghost" href="/api/reports/premium" rel="noreferrer" target="_blank">
                  Open vault
                </a>
              </div>
            </article>

            <article className="mission-card mission-card--static" id="assets">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Infra</span>
              </div>
              <h3>Technical verification</h3>
              <p>Use API status and GitHub if judges want to verify the stack and routes.</p>
              <div className="button-row">
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
