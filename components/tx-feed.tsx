import type { TxLog } from "@/lib/types";
import { shortHash, usd } from "@/lib/format";

interface TxFeedProps {
  transactions: TxLog[];
}

export function TxFeed({ transactions }: TxFeedProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Settlement feed</h2>
        <p>Even the polished demo keeps the core promise visible: every important state change can be inspected, linked, and explained.</p>
      </div>

      <div className="tx-list">
        {transactions.map((tx) => (
          <article className="tx-card" key={tx.id}>
            <div>
              <h3>{tx.label}</h3>
              <p>{tx.createdAt}</p>
            </div>
            <div className="tx-card__meta">
              <span className={`badge badge--${tx.status}`}>{tx.status}</span>
              <strong>{usd(tx.amountUsd)}</strong>
            </div>
            <a href={tx.explorerUrl} target="_blank" rel="noreferrer">
              {shortHash(tx.hash)}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
