import { CopyBlock } from "@/components/copy-block";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getMarginCalculatorSeed,
  getPremiumReportSummary,
  getRecentRunsSummary
} from "@/lib/live-marketplace";
import { siteConfig, submissionNavItems } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Submission Kit",
  description: "Judge-ready submission copy, video flow, and checklist for the Arc Agent Research Marketplace."
};

const technologyTags =
  "Arc, USDC, Circle Wallets, Circle Developer Console, Nanopayments, x402, ERC-8183, ERC-8004, Agent-to-Agent Payments, Next.js, Vercel";

const coverImageDirection =
  "Use a homepage screenshot with the hero headline, live recent runs, tx links, and the premium panel visible in one frame.";

const slideOutline = `Slide 1 - Problem
AI agents still act like internal features instead of economic actors, because traditional gas costs kill per-action settlement.

Slide 2 - Product
Arc Agent Research Marketplace turns one prompt into specialist jobs, pays agents in USDC on Arc, and keeps live tx proof visible in the product.

Slide 3 - Why this matters
The same workflow can also resell the final report through x402, which makes agent output a monetizable onchain asset instead of a one-off demo.

Slide 4 - Live proof
Show recent Arc runs, visible lifecycle tx links, and the <= $0.01 pricing story.

Slide 5 - Business case
Explain the margin calculator: Arc keeps the rail cheap enough for machine-to-machine commerce, while traditional gas-heavy paths collapse the model.`;

export default async function SubmissionPage() {
  const recentRuns = await getRecentRunsSummary();
  const premium = await getPremiumReportSummary(recentRuns);
  const margin = await getMarginCalculatorSeed(recentRuns, premium);

  const latestRun = recentRuns.runs[0];

  const shortDescription =
    "Arc Agent Research Marketplace lets a manager agent split one request into specialist microjobs, pay providers in USDC on Arc, and resell the final report through an x402 premium unlock.";

  const longDescription = `Track: Agent-to-Agent Payment Loop

Arc Agent Research Marketplace is a live agentic commerce demo built for the Arc hackathon. A manager agent takes one research brief, routes it to specialist providers, settles each step in USDC on Arc, and keeps the execution trail visible inside the product.

What the product does:
- Turns one prompt into specialist research, fact-check, and summary jobs
- Uses Circle wallet infrastructure for programmable wallet operations and signing
- Settles jobs on Arc with ERC-8183 lifecycle actions
- Shows recent real runs, budgets, timestamps, tx links, and explorer-ready proof on the homepage
- Adds a premium x402 paywall so the final report can be resold per unlock instead of staying a one-off artifact

Why Arc:
- The model only works if per-action pricing stays <= $0.01
- Arc keeps settlement cheap enough for machine-to-machine commerce
- The economics stay visible instead of forcing bundles, subscriptions, or off-chain credits

Live product proof:
- ${recentRuns.metrics.visibleRuns} recent Arc jobs are currently visible on the homepage
- ${recentRuns.metrics.txLinksVisible} recent lifecycle tx links are currently surfaced in the UI
- Latest visible job: #${latestRun?.jobId ?? "n/a"} (${latestRun?.status ?? "n/a"})
- Premium report unlock: ${premium.unlockPriceUsd.toFixed(3)} USDC
- Break-even premium unlock target: ${margin.breakEvenUnlocks}

Why this is differentiated:
- The demo is not only a launcher; it is also a live proof surface
- The same workflow has both settlement logic and a monetization layer
- Judges can create a new live job from the browser and immediately see it land back in recent runs

Circle Product Feedback
Products used:
- Arc
- USDC
- Circle Wallets / Circle Developer Console
- Nanopayments and x402-compatible premium access flow

Why we chose them:
- We needed stablecoin-native settlement, programmable wallets, and a credible micropayment path for agent-to-agent work.

What worked well:
- Wallet bootstrapping and programmable transaction signing made the live agent settlement flow possible.
- Arc economics made low-value specialist jobs and premium report unlocks feel believable instead of theatrical.

What could be improved:
- Clearer hackathon-specific setup guidance for the Circle console and entity secret registration would reduce onboarding friction.
- Better first-party examples that combine Arc, Circle wallets, and x402 in one reference app would accelerate builder velocity.

Recommendation:
- Ship an end-to-end reference flow for live browser-triggered jobs, wallet bootstrapping, explorer proof, and x402 resale in one starter kit.`;

  const videoScript = `0:00 - Open ${siteConfig.productionUrl}/judges
Say: "This project turns agent workflows into real economic actors on Arc."

0:08 - Point to the live metrics
Call out recent jobs, visible tx links, premium unlock price, and the operator-ready UX.

0:18 - Paste ARC_ADMIN_API_TOKEN and click "Autopilot demo"
Say: "With one click we launch a real Arc job from the browser."

0:28 - Let the flow redirect back to the homepage recent-runs section
Say: "The new job comes back into the live product surface with proof links, timestamps, and budget."

0:42 - Open the premium teaser and then the premium paywall
Say: "The report can now be resold per unlock with x402 instead of living as a dead demo artifact."

0:56 - Open the economics section
Say: "Arc keeps this workflow economically viable at <= $0.01 per action, while traditional gas-heavy paths break the margin."

1:08 - Open the Circle Developer Console and show the wallet / transaction side
This is required in the submission video. Show a real Circle-driven transaction context, not only the frontend.

1:20 - Open the Arc block explorer from one of the tx links on the homepage
This is also required in the submission video. Show the transaction verified on Arc explorer.

1:32 - Close on the homepage
Say: "This is an agent-to-agent payment loop with live Arc settlement, premium resale, and judge-ready proof."`;

  const circleConsoleReminder =
    "The hackathon video requires both a Circle Developer Console transaction step and Arc Block Explorer verification. Use the homepage tx links for the explorer part.";

  return (
    <main className="page-shell">
      <SiteHeader
        navItems={[...submissionNavItems]}
        primaryAction={{ href: "/judges", label: "Open judge mode" }}
        secondaryAction={{ href: siteConfig.githubUrl, label: "GitHub", newTab: true }}
      />

      <section className="hero-panel" id="overview">
        <div className="hero-layout">
          <div>
            <div className="eyebrow">Submission-ready pack</div>
            <h1>Ship the hackathon entry like a finished product.</h1>
            <p className="lede">
              This page bundles the exact copy, video order, and checklist we need for the final
              lablab submission. It is tuned for fast execution: paste the text, record the
              screencast, attach the repo, and submit.
            </p>

            <div className="hero-actions">
              <a className="button button--primary" href="/judges">
                Open judge mode
              </a>
              <a className="button button--ghost" href={siteConfig.productionUrl} target="_blank" rel="noreferrer">
                Open live app
              </a>
            </div>

            <div className="hero-trust">
              <span>Video required</span>
              <span>Live app already deployed</span>
              <span>GitHub already public</span>
              <span>Copy blocks ready</span>
            </div>
          </div>

          <div className="hero-console">
            <div className="hero-console__header">
              <span className="eyebrow">Submission snapshot</span>
              <strong>Everything judges need</strong>
            </div>

            <div className="hero-stats">
              <div>
                <span>Visible live jobs</span>
                <strong>{recentRuns.metrics.visibleRuns}</strong>
              </div>
              <div>
                <span>Visible tx links</span>
                <strong>{recentRuns.metrics.txLinksVisible}</strong>
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
                <span>Application URL</span>
                <strong>{siteConfig.productionUrl.replace("https://", "")}</strong>
              </div>
              <div>
                <span>Latest visible job</span>
                <strong>#{latestRun?.jobId ?? "n/a"} with {latestRun?.status ?? "n/a"} status</strong>
              </div>
              <div>
                <span>Mandatory video step</span>
                <strong>Show Circle console plus Arc explorer proof in the same recording.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel" id="pack">
        <div className="section-heading">
          <div>
            <h2>Asset pack</h2>
            <p>
              These are the concrete pieces the submission needs. Everything below is already
              either available or copy-ready.
            </p>
          </div>
          <span className="eyebrow">Required surfaces</span>
        </div>

        <div className="submission-grid">
          <article className="submission-card">
            <span className="eyebrow">Live app</span>
            <h3>Production URL</h3>
            <p>Use the deployed Vercel app as the demo application platform and application URL.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href={siteConfig.productionUrl} target="_blank" rel="noreferrer">
                Open live app
              </a>
            </div>
          </article>

          <article className="submission-card">
            <span className="eyebrow">Repository</span>
            <h3>Public GitHub</h3>
            <p>The repo is already public and should be attached directly in the lablab form.</p>
            <div className="command-card__actions">
              <a className="button button--primary" href={siteConfig.githubUrl} target="_blank" rel="noreferrer">
                Open GitHub
              </a>
            </div>
          </article>

          <article className="submission-card">
            <span className="eyebrow">Video</span>
            <h3>Transaction-flow screencast</h3>
            <p>{circleConsoleReminder}</p>
            <div className="command-card__actions">
              <a className="button button--primary" href="/judges">
                Open judge mode
              </a>
            </div>
          </article>

          <article className="submission-card">
            <span className="eyebrow">Presentation</span>
            <h3>Slide story</h3>
            <p>Use the five-part slide outline below if the submission asks for a slide deck.</p>
            <div className="command-card__actions">
              <a className="button button--ghost" href="#copy">
                Jump to copy pack
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="panel panel--highlight" id="copy">
        <div className="section-heading">
          <div>
            <h2>Copy-ready submission text</h2>
            <p>
              These blocks are formatted for the lablab form so we do not have to improvise the
              wording during submission.
            </p>
          </div>
          <span className="eyebrow">Copy pack</span>
        </div>

        <div className="submission-copy-grid">
          <CopyBlock
            description="Use this in the short-description field."
            eyebrow="Basic info"
            title="Short description"
            value={shortDescription}
          />
          <CopyBlock
            description="Use this for the tags / technologies field."
            eyebrow="Metadata"
            title="Technology tags"
            value={technologyTags}
          />
          <CopyBlock
            description="Use this guidance when choosing the cover image."
            eyebrow="Presentation"
            title="Cover image direction"
            value={coverImageDirection}
          />
          <CopyBlock
            description="Use this as the long-form submission description, including the Circle Product Feedback section."
            eyebrow="Main body"
            title="Long description"
            value={longDescription}
          />
          <CopyBlock
            description="Use this to build a concise slide deck if the form asks for slides."
            eyebrow="Slides"
            title="Slide outline"
            value={slideOutline}
          />
        </div>
      </section>

      <section className="panel" id="video">
        <div className="section-heading">
          <div>
            <h2>Video recording order</h2>
            <p>
              This is the fastest clean recording path. It keeps the narration tight while still
              satisfying the Circle plus Arc proof requirement.
            </p>
          </div>
          <span className="eyebrow">90-second script</span>
        </div>

        <CopyBlock
          description="Record the screen in this order. You can read this almost line-for-line during the screencast."
          eyebrow="Narration"
          title="Video script"
          value={videoScript}
        />

        <div className="timeline-grid">
          <article className="timeline-card">
            <span className="timeline-card__time">Step 1</span>
            <h3>Open judge mode</h3>
            <p>Start at `/judges`, show the metrics, and frame the story as real agentic commerce.</p>
            <a className="button button--primary" href="/judges">
              Open judge mode
            </a>
          </article>
          <article className="timeline-card">
            <span className="timeline-card__time">Step 2</span>
            <h3>Run autopilot demo</h3>
            <p>Paste the admin token, launch one job, and let the app redirect itself to recent runs.</p>
            <a className="button button--primary" href="/judges#script">
              Start demo flow
            </a>
          </article>
          <article className="timeline-card">
            <span className="timeline-card__time">Step 3</span>
            <h3>Show premium monetization</h3>
            <p>Open the teaser and paywall so judges see that the finished output is resellable inventory.</p>
            <a className="button button--primary" href="/api/reports/teaser" target="_blank" rel="noreferrer">
              Open teaser
            </a>
          </article>
          <article className="timeline-card">
            <span className="timeline-card__time">Step 4</span>
            <h3>Close on technical proof</h3>
            <p>Show Circle console context and one Arc explorer link from the homepage or recent-run trail.</p>
            <a className="button button--ghost" href="/api/arc/status" target="_blank" rel="noreferrer">
              API status
            </a>
          </article>
        </div>
      </section>

      <section className="panel panel--highlight" id="checklist">
        <div className="section-heading">
          <div>
            <h2>Final checklist</h2>
            <p>Use this right before submission so nothing important gets missed.</p>
          </div>
          <span className="eyebrow">Submit cleanly</span>
        </div>

        <div className="submission-checklist">
          <article className="check-item">
            <strong>Video presentation</strong>
            <p>Record the 90-second screencast and include both Circle Developer Console context and Arc explorer verification.</p>
          </article>
          <article className="check-item">
            <strong>Slide presentation</strong>
            <p>Use the slide outline above if the form requires a PDF or link.</p>
          </article>
          <article className="check-item">
            <strong>Public GitHub repository</strong>
            <p>Attach {siteConfig.githubUrl}.</p>
          </article>
          <article className="check-item">
            <strong>Demo application platform</strong>
            <p>Set Vercel as the platform and use the production URL.</p>
          </article>
          <article className="check-item">
            <strong>Application URL</strong>
            <p>{siteConfig.productionUrl}</p>
          </article>
          <article className="check-item">
            <strong>Circle Product Feedback</strong>
            <p>Use the long description block because it already contains a labeled feedback section.</p>
          </article>
          <article className="check-item">
            <strong>Pricing and economics</strong>
            <p>
              Call out the {premium.unlockPriceUsd.toFixed(3)} USDC premium unlock, the live Arc tx
              trail, and the margin explanation.
            </p>
          </article>
          <article className="check-item">
            <strong>Transaction frequency proof</strong>
            <p>
              The environment has already crossed the 50+ transaction target; the homepage shows the
              most recent visible slice of that activity with explorer-ready links.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
