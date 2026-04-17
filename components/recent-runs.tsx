import { shortHash, usd } from "@/lib/format";
import type { RecentRunsSummary } from "@/lib/live-marketplace";

interface RecentRunsProps {
  summary: RecentRunsSummary;
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
        {summary.runs.map((run) => (
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

            <p>{run.description}</p>

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
        ))}
      </div>
    </section>
  );
}
