import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CopyBlock } from "@/components/ui/copy-block";
import { getProjectSnapshot } from "@/lib/live-marketplace";
import { siteConfig, submissionNavItems } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submission Kit",
  description: "Submission-ready copy, demo flow, and checklist for the Arc Agent Research Marketplace."
};

const technologyTags =
  "Arc, Circle Wallets, USDC, x402, Nanopayments, ERC-8183, ERC-8004, Agent-to-Agent Payments, Next.js, Vercel";

export default async function SubmissionPage() {
  const snapshot = await getProjectSnapshot();
  const latestRun = snapshot.recentRuns.runs[0];

  const shortDescription =
    "Arc Agent Research Marketplace lets a manager agent launch specialist jobs, settle them in USDC on Arc, and resell the final report through a premium x402 unlock.";

  const longDescription = `Track: Agent-to-Agent Payment Loop

Arc Agent Research Marketplace is a live Arc-native commerce demo. One request becomes specialist research work, the work settles in USDC on Arc, and the resulting report can be resold through a premium unlock instead of dying as a one-off artifact.

Core product:
- Launch live specialist jobs from the browser
- Show recent Arc runs with explorer-ready transaction links
- Use Circle wallet infrastructure for programmable execution
- Add a premium x402 layer for report resale

Why Arc:
- The product needs sub-cent style economics to keep agent work split into clean specialist legs
- Arc keeps settlement cheap enough for visible agent-to-agent pricing
- The transaction trail stays inside the product instead of being hidden off-chain

Live proof:
- ${snapshot.recentRuns.metrics.visibleRuns} recent jobs visible on the homepage
- ${snapshot.recentRuns.metrics.txLinksVisible} explorer-ready transaction links currently surfaced
- Latest visible job: #${latestRun?.jobId ?? "n/a"} (${latestRun?.status ?? "n/a"})
- Premium report unlock: ${snapshot.premium.unlockPriceUsd.toFixed(3)} USDC

Circle Product Feedback:
- Circle wallets and programmable signing made the live settlement flow believable
- The main friction point was onboarding around entity secret registration and console setup
- A first-party starter that combines Arc, Circle wallets, and x402 in one reference app would help builders move faster`;

  const videoScript = `0:00 - Open ${siteConfig.productionUrl}
Say: "This project turns one brief into specialist Arc jobs with visible payment proof."

0:10 - Show recent jobs and transaction links on the homepage

0:20 - Open ${siteConfig.productionUrl}/judges and paste ARC_ADMIN_API_TOKEN

0:30 - Click Run autopilot
Say: "With one click we create a fresh Arc job from the browser."

0:45 - Let the page redirect back to the dashboard and show the new live run

0:55 - Open the teaser and then the premium unlock
Say: "The final report can now be resold per unlock through x402."

1:05 - Show API status, Circle console context, and one Arc explorer transaction link

1:20 - Close on the homepage`;

  return (
    <main className="app-shell">
      <SiteHeader
        navItems={[...submissionNavItems]}
        primaryAction={{ href: "/judges", label: "Open judge mode" }}
        secondaryAction={{ href: "/", label: "Back to dashboard" }}
      />

      <section className="hero-surface" id="overview">
        <div className="hero-grid">
          <div>
            <span className="pill">Submission Kit</span>
            <h1>Everything needed to submit cleanly.</h1>
            <p className="hero-copy">
              This page keeps the hackathon submission practical: key metrics, copy blocks, video
              order, and the final checklist in one place.
            </p>

            <div className="hero-tags">
              <span>Live app ready</span>
              <span>Public GitHub ready</span>
              <span>Video script ready</span>
            </div>
          </div>

          <aside className="hero-rail">
            <div className="metric-grid metric-grid--compact">
              <article className="metric-card">
                <span>App URL</span>
                <strong>{siteConfig.productionUrl.replace("https://", "")}</strong>
              </article>
              <article className="metric-card">
                <span>Visible jobs</span>
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
            </div>
          </aside>
        </div>
      </section>

      <div className="section-stack">
        <section className="surface">
          <div className="section-head">
            <div>
              <span className="pill">Assets</span>
              <h2>Core links</h2>
              <p>Use these directly in the submission form and during the final recording.</p>
            </div>
          </div>

          <div className="launch-grid">
            <article className="launch-card">
              <span className="pill pill--soft">Live app</span>
              <h3>Production deployment</h3>
              <p>Use the deployed Vercel app as the project URL.</p>
              <div className="link-row">
                <a className="button button--primary" href={siteConfig.productionUrl} rel="noreferrer" target="_blank">
                  Open app
                </a>
              </div>
            </article>

            <article className="launch-card">
              <span className="pill pill--soft">Repository</span>
              <h3>Public GitHub</h3>
              <p>Attach the public repository directly in the submission.</p>
              <div className="link-row">
                <a className="button button--primary" href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
                  Open GitHub
                </a>
              </div>
            </article>

            <article className="launch-card">
              <span className="pill pill--soft">Demo mode</span>
              <h3>Judge-ready flow</h3>
              <p>Use judge mode for the cleanest one-click presentation path.</p>
              <div className="link-row">
                <a className="button button--primary" href="/judges">
                  Open judge mode
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="surface" id="copy">
          <div className="section-head">
            <div>
              <span className="pill">Copy Pack</span>
              <h2>Submission-ready text</h2>
              <p>Paste these blocks directly into the lablab submission fields.</p>
            </div>
          </div>

          <div className="copy-grid">
            <CopyBlock
              description="Use this for the short description field."
              eyebrow="Summary"
              title="Short description"
              value={shortDescription}
            />
            <CopyBlock
              description="Use this for the technology tags field."
              eyebrow="Metadata"
              title="Technology tags"
              value={technologyTags}
            />
            <CopyBlock
              description="Use this for the long project description."
              eyebrow="Main copy"
              title="Long description"
              value={longDescription}
            />
          </div>
        </section>

        <section className="surface" id="video">
          <div className="section-head">
            <div>
              <span className="pill">Video</span>
              <h2>Recording order</h2>
              <p>Follow this order to keep the demo short, credible, and easy to record.</p>
            </div>
          </div>

          <div className="copy-grid">
            <CopyBlock
              description="Read this almost line-for-line during the screencast."
              eyebrow="Narration"
              title="Video script"
              value={videoScript}
            />
          </div>
        </section>

        <section className="surface" id="checklist">
          <div className="section-head">
            <div>
              <span className="pill">Checklist</span>
              <h2>Final submission checklist</h2>
              <p>Use this just before submitting so nothing important is missed.</p>
            </div>
          </div>

          <div className="check-grid">
            <article className="check-card">
              <strong>Attach the live app URL</strong>
              <p>{siteConfig.productionUrl}</p>
            </article>
            <article className="check-card">
              <strong>Attach the public GitHub repository</strong>
              <p>{siteConfig.githubUrl}</p>
            </article>
            <article className="check-card">
              <strong>Record the video</strong>
              <p>Show the dashboard, one live run, Circle console context, and one Arc explorer transaction.</p>
            </article>
            <article className="check-card">
              <strong>Call out the business model</strong>
              <p>Explain the premium x402 unlock and why Arc pricing keeps it viable.</p>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
