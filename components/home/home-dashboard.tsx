"use client";

import { startTransition, useEffect, useState } from "react";
import { ARC_CONTRACTS, arcTestnet, hackathonTargets } from "@/lib/arc";
import { shortHash, usd } from "@/lib/format";
import type { AgentRegistryEntry, PremiumReportSummary, ProjectSnapshot, RecentRunsSummary } from "@/lib/live-marketplace";
import { buildLaunchHref, launchPresets, siteConfig } from "@/lib/site";
import { ArcEconomics } from "@/components/home/arc-economics";
import { LiveRunsBoard } from "@/components/home/live-runs-board";

interface HomeDashboardProps {
  initialSnapshot: ProjectSnapshot;
  focusJobId?: string;
}

function formatSyncLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

function PremiumRail({ summary }: { summary: PremiumReportSummary }) {
  return (
    <section className="surface" id="premium">
      <div className="section-head">
        <div>
          <span className="pill">Premium Layer</span>
          <h2>Resell the finished report</h2>
          <p>
            The same workflow that creates Arc jobs can also monetize its output. Judges can see a
            public teaser first and then the protected x402 unlock for the full report.
          </p>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Unlock price</span>
          <strong>{usd(summary.unlockPriceUsd)}</strong>
        </article>
        <article className="metric-card">
          <span>Seller wallet</span>
          <strong>{shortHash(summary.sellerAddress)}</strong>
        </article>
        <article className="metric-card">
          <span>Payment rail</span>
          <strong>{summary.paymentRail}</strong>
        </article>
      </div>

      <p className="surface-note">{summary.summary}</p>

      <div className="link-row">
        <a className="button button--primary" href={summary.teaserPath} rel="noreferrer" target="_blank">
          Open teaser
        </a>
        <a className="button button--ghost" href={summary.endpointPath} rel="noreferrer" target="_blank">
          Open premium unlock
        </a>
        <a className="button button--ghost" href={summary.sellerExplorerUrl} rel="noreferrer" target="_blank">
          Seller wallet
        </a>
      </div>
    </section>
  );
}

function LaunchHub() {
  return (
    <section className="surface" id="launcher">
      <div className="section-head">
        <div>
          <span className="pill">Launcher</span>
          <h2>Start a real job from the browser</h2>
          <p>
            Keep the demo simple on stage: pick a preset, open the browser launcher, and let the
            result page show the Arc transaction trail automatically.
          </p>
        </div>
        <div className="link-row">
          <a className="button button--primary" href="/launch">
            Open launcher
          </a>
          <a className="button button--ghost" href="/judges">
            Judge mode
          </a>
          <a className="button button--ghost" href="/api/arc/status" rel="noreferrer" target="_blank">
            API status
          </a>
        </div>
      </div>

      <div className="launch-grid">
        {launchPresets.map((preset) => (
          <article className="launch-card" key={preset.role}>
            <span className="pill pill--soft">{preset.role}</span>
            <h3>{preset.title}</h3>
            <p>{preset.description}</p>
            <div className="link-row">
                <a className="button button--primary" href={buildLaunchHref(preset.role, preset.description)}>
                  Prefill launcher
                </a>
                <a
                  className="button button--ghost"
                  href={`${buildLaunchHref(preset.role, preset.description)}#form`}
                >
                  Review prompt
                </a>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

function NetworkRail({
  agents,
  recentRuns
}: {
  agents: AgentRegistryEntry[];
  recentRuns: RecentRunsSummary;
}) {
  return (
    <section className="surface" id="network">
      <div className="section-head">
        <div>
          <span className="pill">Network Rail</span>
          <h2>Arc context and wallet map</h2>
          <p>
            This keeps the technical proof close to the product: which chain is used, which
            contract drives the jobs, and which wallets power the visible specialists.
          </p>
        </div>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <span>Network</span>
          <strong>{arcTestnet.name}</strong>
        </article>
        <article className="metric-card">
          <span>Pricing target</span>
          <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
        </article>
        <article className="metric-card">
          <span>AgenticCommerce</span>
          <strong>{shortHash(ARC_CONTRACTS.agenticCommerce)}</strong>
        </article>
        <article className="metric-card">
          <span>Visible tx trail</span>
          <strong>{recentRuns.metrics.txLinksVisible} links</strong>
        </article>
      </div>

      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-card" key={agent.id}>
            <span className="pill pill--soft">{agent.role}</span>
            <h3>{agent.name}</h3>
            <p>{agent.specialty}</p>
            <dl className="detail-list">
              <div>
                <dt>Wallet</dt>
                <dd>
                  <a href={agent.walletExplorerUrl} rel="noreferrer" target="_blank">
                    {shortHash(agent.walletAddress)}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Lane</dt>
                <dd>{agent.payoutLabel}</dd>
              </div>
              <div>
                <dt>Validation</dt>
                <dd>{agent.validationLabel}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeDashboard({ initialSnapshot, focusJobId }: HomeDashboardProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(() => formatSyncLabel(new Date()));

  async function refreshSnapshot() {
    try {
      setIsRefreshing(true);
      setRefreshError(null);

      const response = await fetch("/api/projects", {
        method: "GET",
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Could not refresh the live Arc snapshot.");
      }

      const payload = (await response.json()) as ProjectSnapshot;

      startTransition(() => {
        setSnapshot(payload);
        setLastUpdatedLabel(formatSyncLabel(new Date()));
      });
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unknown refresh error.");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshSnapshot();
    }, 15_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const latestRun = snapshot.recentRuns.runs[0];

  return (
    <>
      <section className="hero-surface" id="overview">
        <div className="hero-grid">
          <div>
            <span className="pill">Arc Hackathon Demo</span>
            <h1>Agent-to-agent work needs a real payment rail.</h1>
            <p className="hero-copy">
              {siteConfig.name} turns one brief into specialist jobs, settles those jobs in USDC on
              Arc, keeps explorer links in the product, and adds a premium unlock layer for report
              resale.
            </p>

            <div className="link-row">
              <a className="button button--primary" href="/launch">
                Launch a live job
              </a>
              <a className="button button--ghost" href="#live-feed">
                View live runs
              </a>
              <a className="button button--ghost" href="/judges">
                Open judge mode
              </a>
            </div>

            <div className="hero-tags">
              <span>Live Arc logs</span>
              <span>Circle wallets</span>
              <span>Explorer-ready tx proof</span>
              <span>x402 premium unlock</span>
            </div>
          </div>

          <aside className="hero-rail">
            <div className="metric-grid metric-grid--compact">
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
                <strong>{usd(snapshot.premium.unlockPriceUsd)}</strong>
              </article>
              <article className="metric-card">
                <span>Per-action target</span>
                <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
              </article>
            </div>

            <div className="callout">
              <span className="pill pill--soft">Live state</span>
              <p>
                Latest visible run:{" "}
                <strong>{latestRun ? `#${latestRun.jobId} ${latestRun.status}` : "waiting for first job"}</strong>
              </p>
              <p>Auto-refresh keeps the feed current every 15 seconds.</p>
              <p>Last sync: {lastUpdatedLabel}</p>
              {refreshError ? <p className="error-text">{refreshError}</p> : null}
            </div>
          </aside>
        </div>
      </section>

      <div className="section-stack">
        <LaunchHub />
        <LiveRunsBoard
          focusJobId={focusJobId}
          isRefreshing={isRefreshing}
          lastUpdatedLabel={lastUpdatedLabel}
          onRefresh={refreshSnapshot}
          summary={snapshot.recentRuns}
        />

        <div className="split-grid">
          <PremiumRail summary={snapshot.premium} />
          <ArcEconomics seed={snapshot.margin} />
        </div>

        <NetworkRail agents={snapshot.agents} recentRuns={snapshot.recentRuns} />
      </div>
    </>
  );
}
