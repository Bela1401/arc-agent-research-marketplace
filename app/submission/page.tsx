import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CopyBlock } from "@/components/ui/copy-block";
import { getProjectSnapshot } from "@/lib/live-marketplace";
import { siteConfig, submissionNavItems } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arc Ops Submission Kit",
  description: "Submission-ready copy and video flow for the Arc Ops hackathon demo."
};

const technologyTags =
  "Arc, Circle Wallets, USDC, x402, Nanopayments, ERC-8183, ERC-8004, Agent-to-Agent Payments, Next.js, Vercel";

export default async function SubmissionPage() {
  const snapshot = await getProjectSnapshot();
  const latestRun = snapshot.recentRuns.runs[0];

  const shortDescription =
    "Arc Ops is a playable mission-control demo where each cleared mission launches a real Arc job, exposes the tx trail, and feeds a premium x402 Intel Vault.";

  const longDescription = `Track: Agent-to-Agent Payment Loop

Arc Ops is a live Arc-native mission-control game. One player action becomes a real specialist Arc mission, the work settles in USDC on Arc, and the final output can be resold through a premium unlock instead of dying as a one-off artifact.

Core product:
- Launch live Arc missions from the browser
- Show a replay board with explorer-ready transaction links
- Use Circle wallet infrastructure for programmable execution
- Add an x402-powered Intel Vault for report resale

Why Arc:
- The product needs low per-action cost to keep specialist missions separate
- Arc keeps settlement cheap enough for visible agent-to-agent gameplay
- The transaction trail stays inside the product instead of disappearing behind backend logs

Live proof:
- ${snapshot.recentRuns.metrics.visibleRuns} recent missions visible on the homepage
- ${snapshot.recentRuns.metrics.txLinksVisible} explorer-ready replay links currently surfaced
- Latest visible mission: #${latestRun?.jobId ?? "n/a"} (${latestRun?.status ?? "n/a"})
- Premium vault unlock: ${snapshot.premium.unlockPriceUsd.toFixed(3)} USDC

Circle Product Feedback:
- Circle wallets and programmable signing made the live settlement flow believable
- The main friction point was onboarding around entity secret registration and console setup
- A first-party starter that combines Arc, Circle wallets, and x402 in one reference app would help builders move faster`;

  const videoScript = `0:00 - Open ${siteConfig.productionUrl}
Say: "This project turns the Arc payment loop into a playable mission-control game."

0:10 - Show the Arena, mission cards, and replay board on the homepage

0:20 - Open ${siteConfig.productionUrl}/judges and paste ARC_ADMIN_API_TOKEN

0:30 - Click Run speedrun
Say: "With one click we clear a fresh Arc mission from the browser."

0:45 - Let the page redirect back to the replay board and show the new live mission

0:55 - Open the teaser and then the premium vault
Say: "The final output can now be resold per unlock through x402."

1:05 - Show API status, Circle console context, and one Arc explorer transaction link

1:20 - Close on the homepage`;

  return (
    <main className="app-shell">
      <SiteHeader
        navItems={[...submissionNavItems]}
        primaryAction={{ href: "/judges", label: "Open judge speedrun" }}
        secondaryAction={{ href: "/", label: "Back to Arc Ops" }}
      />

      <section className="hero-board hero-board--judge" id="overview">
        <div className="hero-board__content">
          <span className="eyebrow">Submission Kit</span>
          <h1>Everything needed to submit Arc Ops cleanly.</h1>
          <p className="hero-copy">
            This page keeps the submission practical: copy blocks, video order, and the final
            checklist in one place.
          </p>

          <div className="hero-pills">
            <span>Live app ready</span>
            <span>Public GitHub ready</span>
            <span>Video script ready</span>
          </div>
        </div>

        <aside className="hero-hud">
          <div className="score-grid">
            <article className="score-card">
              <span>App URL</span>
              <strong>{siteConfig.productionUrl.replace("https://", "")}</strong>
            </article>
            <article className="score-card">
              <span>Visible jobs</span>
              <strong>{snapshot.recentRuns.metrics.visibleRuns}</strong>
            </article>
            <article className="score-card">
              <span>Visible tx links</span>
              <strong>{snapshot.recentRuns.metrics.txLinksVisible}</strong>
            </article>
            <article className="score-card">
              <span>Vault key</span>
              <strong>{snapshot.premium.unlockPriceUsd.toFixed(3)} USDC</strong>
            </article>
          </div>
        </aside>
      </section>

      <div className="arena-stack">
        <section className="game-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Assets</span>
              <h2>Core links</h2>
              <p>Use these directly in the submission form and during the final recording.</p>
            </div>
          </div>

          <div className="mission-grid">
            <article className="mission-card mission-card--static">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Live app</span>
              </div>
              <h3>Production deployment</h3>
              <p>Use the deployed Vercel app as the project URL.</p>
              <div className="button-row">
                <a className="button button--primary" href={siteConfig.productionUrl} rel="noreferrer" target="_blank">
                  Open app
                </a>
              </div>
            </article>

            <article className="mission-card mission-card--static">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Repository</span>
              </div>
              <h3>Public GitHub</h3>
              <p>Attach the public repository directly in the submission.</p>
              <div className="button-row">
                <a className="button button--primary" href={siteConfig.githubUrl} rel="noreferrer" target="_blank">
                  Open GitHub
                </a>
              </div>
            </article>

            <article className="mission-card mission-card--static">
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">Demo mode</span>
              </div>
              <h3>Judge-ready flow</h3>
              <p>Use judge mode for the cleanest one-click presentation path.</p>
              <div className="button-row">
                <a className="button button--primary" href="/judges">
                  Open judge speedrun
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="game-panel" id="copy">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Copy Pack</span>
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

        <section className="game-panel" id="video">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Video</span>
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

        <section className="game-panel" id="checklist">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Checklist</span>
              <h2>Final submission checklist</h2>
              <p>Use this right before submitting so nothing important gets missed.</p>
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
              <p>Show the game board, one live mission, Circle Console context, and one Arc explorer transaction.</p>
            </article>
            <article className="check-card">
              <strong>Call out the business model</strong>
              <p>Explain the premium Intel Vault and why Arc pricing keeps the mission loop viable.</p>
            </article>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
