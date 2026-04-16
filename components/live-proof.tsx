import { shortHash, usd } from "@/lib/format";
import { liveArcProof } from "@/lib/live-proof";

export function LiveProofPanel() {
  return (
    <section className="panel panel--highlight">
      <div className="section-heading">
        <h2>Live Arc proof</h2>
        <p>
          These results come from a successful Arc Testnet run completed on {liveArcProof.capturedAt},
          with real Circle wallets, real agent registration, and real ERC-8183 settlements.
        </p>
      </div>

      <div className="proof-stat-grid">
        <article>
          <span>Completed jobs</span>
          <strong>{liveArcProof.stats.completedJobs}</strong>
        </article>
        <article>
          <span>ERC-8183 tx proved</span>
          <strong>{liveArcProof.stats.erc8183Transactions}</strong>
        </article>
        <article>
          <span>Live wallets</span>
          <strong>{liveArcProof.stats.liveWallets}</strong>
        </article>
        <article>
          <span>Avg budget</span>
          <strong>{usd(liveArcProof.stats.averageBudgetUsd)}</strong>
        </article>
      </div>

      <div className="proof-layout">
        <article className="proof-card">
          <div className="proof-card__header">
            <div>
              <span className="eyebrow">Wallet map</span>
              <h3>Circle wallet set {liveArcProof.walletSetId.slice(0, 8)}...</h3>
            </div>
            <span className="badge">{liveArcProof.registeredAgents} agents registered</span>
          </div>

          <div className="proof-wallet-list">
            {liveArcProof.wallets.map((wallet) => (
              <div className="proof-wallet-item" key={wallet.address}>
                <div>
                  <strong>{wallet.role}</strong>
                  <p>{wallet.purpose}</p>
                </div>
                <code>{wallet.address}</code>
              </div>
            ))}
          </div>

          <div className="proof-note">
            <span className="eyebrow">Registration</span>
            <p>{liveArcProof.registeredAgentNote}</p>
            <p>
              Example validator output: summary agent ID {liveArcProof.summaryAgentId} with tag{" "}
              <code>{liveArcProof.summaryValidationTag}</code>.
            </p>
          </div>
        </article>

        <div className="proof-job-list">
          {liveArcProof.jobs.map((job) => (
            <article className="proof-card" key={job.id}>
              <div className="proof-card__header">
                <div>
                  <span className="badge">{job.role}</span>
                  <h3>Job #{job.id}</h3>
                </div>
                <strong>{usd(job.budgetUsd)}</strong>
              </div>

              <p>
                {job.providerName} executed the {job.role} leg of the marketplace flow using wallet{" "}
                <code>{job.providerWallet}</code>.
              </p>

              <dl className="proof-meta">
                <div>
                  <dt>Deliverable hash</dt>
                  <dd>{shortHash(job.deliverableHash)}</dd>
                </div>
                <div>
                  <dt>Lifecycle</dt>
                  <dd>{job.transactions.length} proof links captured</dd>
                </div>
              </dl>

              <div className="proof-links">
                {job.transactions.map((item) => (
                  <a href={item.explorerUrl} key={item.hash} rel="noreferrer" target="_blank">
                    <span>{item.label}</span>
                    <strong>{shortHash(item.hash)}</strong>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
