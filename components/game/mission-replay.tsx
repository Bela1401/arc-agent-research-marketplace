"use client";

import { shortHash } from "@/lib/format";
import type { RecentArcRun, RecentRunsSummary } from "@/lib/live-marketplace";

interface MissionReplayProps {
  summary: RecentRunsSummary;
  focusJobId?: string;
  isRefreshing: boolean;
  lastUpdatedLabel: string;
  onRefresh: () => Promise<void> | void;
}

function missionLabel(run: RecentArcRun) {
  if (run.providerRole === "research") {
    return "Scout";
  }

  if (run.providerRole === "factCheck") {
    return "Verifier";
  }

  if (run.providerRole === "summary") {
    return "Broadcaster";
  }

  return "Wild signal";
}

function summarizeDescription(description: string) {
  const trimmed = description.trim();

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const eventType = typeof parsed.eventType === "string" ? parsed.eventType.replaceAll("_", " ") : null;
    const summary =
      typeof parsed.summary === "string"
        ? parsed.summary
        : "Structured onchain payload captured from the Arc mission.";

    return {
      title: eventType ?? "Structured mission payload",
      summary
    };
  } catch {
    return {
      title: "Mission brief",
      summary: trimmed
    };
  }
}

export function MissionReplay({
  summary,
  focusJobId,
  isRefreshing,
  lastUpdatedLabel,
  onRefresh
}: MissionReplayProps) {
  return (
    <section className="game-panel" id="replay">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Mission Replay</span>
          <h2>Live Arc runs become playable replays</h2>
          <p>
            Every card below is pulled from live Arc logs or the proof fallback, then enriched with
            the transaction sequence judges can inspect in the explorer.
          </p>
        </div>

        <div className="panel-tools">
          <span className="status-badge">{summary.source === "rpc" ? "Live RPC" : "Proof fallback"}</span>
          <span className="status-text">Synced {lastUpdatedLabel}</span>
          <button className="button button--ghost" onClick={() => void onRefresh()} type="button">
            {isRefreshing ? "Refreshing..." : "Refresh replay"}
          </button>
        </div>
      </div>

      <div className="score-grid">
        <article className="score-card">
          <span>Missions visible</span>
          <strong>{summary.metrics.visibleRuns}</strong>
        </article>
        <article className="score-card">
          <span>Replay links</span>
          <strong>{summary.metrics.txLinksVisible}</strong>
        </article>
        <article className="score-card">
          <span>Latest timestamp</span>
          <strong>{summary.metrics.latestCreatedAtLabel}</strong>
        </article>
      </div>

      <div className="replay-grid">
        {summary.runs.map((run) => {
          const parsed = summarizeDescription(run.description);
          const focused = run.jobId === focusJobId;

          return (
            <article className={`replay-card ${focused ? "replay-card--focused" : ""}`} key={run.jobId}>
              <div className="replay-card__head">
                <div>
                  <span className="eyebrow eyebrow--soft">{missionLabel(run)}</span>
                  <h3>Mission #{run.jobId}</h3>
                </div>
                <div className="replay-card__status">
                  <span className={`status-badge status-badge--${run.status.toLowerCase()}`}>{run.status}</span>
                  <strong>{run.budgetUsd.toFixed(3)} USDC</strong>
                </div>
              </div>

              <div className="replay-card__body">
                <strong>{parsed.title}</strong>
                <p>{parsed.summary}</p>
              </div>

              <div className="replay-meta">
                <span>{run.createdAtLabel}</span>
                <span>{run.providerName}</span>
                <span>{run.trailCoverageLabel}</span>
              </div>

              <div className="timeline-list">
                {run.txTrail.map((tx) => (
                  <a className="timeline-node" href={tx.explorerUrl} key={`${run.jobId}-${tx.hash}`} rel="noreferrer" target="_blank">
                    <span>{tx.label}</span>
                    <strong>{shortHash(tx.hash)}</strong>
                  </a>
                ))}
              </div>

              <details className="inspect-box">
                <summary>Inspect payload and wallets</summary>
                <div className="inspect-box__body">
                  <p>{run.description}</p>
                  <p>
                    Provider:{" "}
                    <a href={run.providerExplorerUrl} rel="noreferrer" target="_blank">
                      {shortHash(run.providerWallet)}
                    </a>
                  </p>
                  <p>
                    Client:{" "}
                    <a href={run.clientExplorerUrl} rel="noreferrer" target="_blank">
                      {shortHash(run.clientWallet)}
                    </a>
                  </p>
                </div>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
