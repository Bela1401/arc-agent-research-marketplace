import { shortHash, usd } from "@/lib/format";
import type { RecentArcRun, RecentRunsSummary } from "@/lib/live-marketplace";

interface RecentRunsProps {
  summary: RecentRunsSummary;
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

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function parseDescription(description: string, run: RecentArcRun): ParsedDescription {
  const trimmed = description.trim();

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (isRecord(parsed)) {
      const eventType =
        typeof parsed.eventType === "string" ? parsed.eventType.replaceAll("_", " ") : null;
      const coordinates = isRecord(parsed.coordinates)
        ? `${parsed.coordinates.lat ?? "?"}, ${parsed.coordinates.lng ?? "?"}`
        : null;
      const summary =
        typeof parsed.summary === "string"
          ? parsed.summary
          : `${run.providerDescriptor} This job is being rendered from a structured onchain payload.`;
      const facts = Object.entries(parsed)
        .filter(([key]) => key !== "summary" && key !== "description")
        .slice(0, 5)
        .map(([key, value]) => ({
          label: humanizeKey(key),
          value: key === "coordinates" && coordinates ? coordinates : stringifyFact(value)
        }));

      return {
        headline: eventType ? humanizeKey(eventType.toLowerCase()) : run.providerLabel,
        summary,
        raw: JSON.stringify(parsed, null, 2),
        facts
      };
    }
  } catch {
    // Fall back to plain text rendering.
  }

  return {
    headline: run.providerLabel,
    summary: trimmed,
    raw: trimmed,
    facts: []
  };
}

export function RecentRuns({ summary }: RecentRunsProps) {
  return (
    <section className="panel panel--highlight" id="recent">
      <div className="section-heading">
        <div>
          <h2>Recent Arc runs</h2>
          <p>
            The homepage now reads recent jobs from live Arc contract logs and keeps explorer-ready
            proof links visible without falling back to mock rows.
          </p>
        </div>
        <span className="eyebrow">{summary.source === "rpc" ? "Live RPC feed" : "Proof fallback"}</span>
      </div>

      <div className="proof-stat-grid">
        <article>
          <span>Visible jobs</span>
          <strong>{summary.metrics.visibleRuns}</strong>
        </article>
        <article>
          <span>Tx links visible</span>
          <strong>{summary.metrics.txLinksVisible}</strong>
        </article>
        <article>
          <span>Avg budget</span>
          <strong>{usd(summary.metrics.averageBudgetUsd)}</strong>
        </article>
        <article>
          <span>Latest timestamp</span>
          <strong>{summary.metrics.latestCreatedAtLabel}</strong>
        </article>
      </div>

      <p className="section-note">{summary.note}</p>

      <div className="recent-run-grid">
        {summary.runs.map((run) => {
          const parsedDescription = parseDescription(run.description, run);

          return (
            <article className="recent-run-card" key={run.jobId}>
              <div className="recent-run-card__top">
                <div>
                  <span className="eyebrow">{run.providerLabel}</span>
                  <h3>Job #{run.jobId}</h3>
                </div>
                <div className="recent-run-card__status">
                  <span className={`status status--${run.status.toLowerCase()}`}>{run.status}</span>
                  <strong>{usd(run.budgetUsd)}</strong>
                </div>
              </div>

              <div className="recent-run-card__body">
                <div className="recent-run-card__summary">
                  <strong>{parsedDescription.headline}</strong>
                  <p>{parsedDescription.summary}</p>
                </div>

                {parsedDescription.facts.length > 0 ? (
                  <div className="recent-run-card__facts">
                    {parsedDescription.facts.map((fact) => (
                      <span className="badge badge--soft" key={`${run.jobId}-${fact.label}`}>
                        {fact.label}: {fact.value}
                      </span>
                    ))}
                  </div>
                ) : null}

                <details className="recent-run-card__raw">
                  <summary>Raw payload</summary>
                  <pre>{parsedDescription.raw}</pre>
                </details>
              </div>

              <dl className="recent-run-card__meta">
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
                  <dt>Trail coverage</dt>
                  <dd>{run.trailCoverageLabel}</dd>
                </div>
              </dl>

              <div className="recent-run-card__trail">
                {run.txTrail.map((tx) => (
                  <a href={tx.explorerUrl} key={`${run.jobId}-${tx.hash}`} rel="noreferrer" target="_blank">
                    <span>{tx.label}</span>
                    <strong>{shortHash(tx.hash)}</strong>
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
