"use client";

import { shortHash, usd } from "@/lib/format";
import type { RecentArcRun, RecentRunsSummary } from "@/lib/live-marketplace";

interface LiveRunsBoardProps {
  summary: RecentRunsSummary;
  focusJobId?: string;
  isRefreshing?: boolean;
  lastUpdatedLabel: string;
  onRefresh: () => void | Promise<void>;
}

interface ParsedDescription {
  headline: string;
  summary: string;
  raw: string;
  facts: Array<{ label: string; value: string }>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function humanizeKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function stringifyFact(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyFact(item)).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .slice(0, 2)
      .map(([key, item]) => `${key}: ${stringifyFact(item)}`)
      .join(" | ");
  }

  return "n/a";
}

function parseDescription(description: string, run: RecentArcRun): ParsedDescription {
  const trimmed = description.trim();

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (isRecord(parsed)) {
      const eventType =
        typeof parsed.eventType === "string" ? parsed.eventType.replaceAll("_", " ") : null;
      const summary =
        typeof parsed.summary === "string"
          ? parsed.summary
          : `${run.providerDescriptor} The job payload was submitted as structured onchain JSON.`;

      const facts = Object.entries(parsed)
        .filter(([key]) => !["summary", "description", "prompt"].includes(key))
        .slice(0, 4)
        .map(([key, value]) => ({
          label: humanizeKey(key),
          value: stringifyFact(value)
        }));

      return {
        headline: eventType ? humanizeKey(eventType.toLowerCase()) : run.providerLabel,
        summary,
        raw: JSON.stringify(parsed, null, 2),
        facts
      };
    }
  } catch {
    // Plain text descriptions fall through to the basic view.
  }

  return {
    headline: run.providerLabel,
    summary: trimmed,
    raw: trimmed,
    facts: []
  };
}

export function LiveRunsBoard({
  summary,
  focusJobId,
  isRefreshing,
  lastUpdatedLabel,
  onRefresh
}: LiveRunsBoardProps) {
  return (
    <section className="surface" id="live-feed">
      <div className="section-head">
        <div>
          <span className="pill">Live Arc Feed</span>
          <h2>Recent jobs with visible tx trails</h2>
          <p>
            This board reads live Arc logs, keeps explorer-ready transaction links visible, and
            refreshes automatically so new jobs appear without a manual rebuild.
          </p>
        </div>

        <div className="section-head__actions">
          <span className="status-chip">{summary.source === "rpc" ? "Live RPC" : "Proof fallback"}</span>
          <span className="sync-note">Updated {lastUpdatedLabel}</span>
          <button className="button button--ghost" onClick={() => void onRefresh()} type="button">
            {isRefreshing ? "Refreshing..." : "Refresh now"}
          </button>
        </div>
      </div>

      <div className="metric-grid metric-grid--compact">
        <article className="metric-card">
          <span>Visible jobs</span>
          <strong>{summary.metrics.visibleRuns}</strong>
        </article>
        <article className="metric-card">
          <span>Tx links</span>
          <strong>{summary.metrics.txLinksVisible}</strong>
        </article>
        <article className="metric-card">
          <span>Average budget</span>
          <strong>{usd(summary.metrics.averageBudgetUsd)}</strong>
        </article>
        <article className="metric-card">
          <span>Latest activity</span>
          <strong>{summary.metrics.latestCreatedAtLabel}</strong>
        </article>
      </div>

      <p className="surface-note">{summary.note}</p>

      <div className="run-grid">
        {summary.runs.map((run) => {
          const parsed = parseDescription(run.description, run);
          const isFocused = focusJobId === run.jobId;

          return (
            <article className={`run-card ${isFocused ? "run-card--focused" : ""}`} key={run.jobId}>
              <div className="run-card__top">
                <div>
                  <span className="pill pill--soft">{isFocused ? "Latest demo run" : run.providerLabel}</span>
                  <h3>Job #{run.jobId}</h3>
                </div>
                <div className="run-card__budget">
                  <span className={`status-chip status-chip--${run.status.toLowerCase()}`}>{run.status}</span>
                  <strong>{usd(run.budgetUsd)}</strong>
                </div>
              </div>

              <div className="run-card__body">
                <div className="run-card__summary">
                  <strong>{parsed.headline}</strong>
                  <p>{parsed.summary}</p>
                </div>

                {parsed.facts.length > 0 ? (
                  <div className="run-chip-row">
                    {parsed.facts.map((fact) => (
                      <span className="run-chip" key={`${run.jobId}-${fact.label}`}>
                        {fact.label}: {fact.value}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <dl className="detail-list">
                <div>
                  <dt>Created</dt>
                  <dd>{run.createdAtLabel}</dd>
                </div>
                <div>
                  <dt>Provider</dt>
                  <dd>
                    <a href={run.providerExplorerUrl} rel="noreferrer" target="_blank">
                      {shortHash(run.providerWallet)}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Client</dt>
                  <dd>
                    <a href={run.clientExplorerUrl} rel="noreferrer" target="_blank">
                      {shortHash(run.clientWallet)}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Coverage</dt>
                  <dd>{run.trailCoverageLabel}</dd>
                </div>
              </dl>

              <div className="trail-list">
                {run.txTrail.map((tx) => (
                  <a className="trail-pill" href={tx.explorerUrl} key={`${run.jobId}-${tx.hash}`} rel="noreferrer" target="_blank">
                    <span>{tx.label}</span>
                    <strong>{shortHash(tx.hash)}</strong>
                  </a>
                ))}
              </div>

              <details className="payload-box">
                <summary>Raw payload</summary>
                <pre>{parsed.raw}</pre>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
