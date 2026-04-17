import type { AgentRegistryEntry } from "@/lib/live-marketplace";

interface AgentRegistryProps {
  agents: AgentRegistryEntry[];
}

export function AgentRegistry({ agents }: AgentRegistryProps) {
  return (
    <section className="panel" id="agents">
      <div className="section-heading">
        <div>
          <h2>Live wallet registry</h2>
          <p>
            These roles are wired to the actual configured Arc wallets used by the demo, including
            the seller wallet that can receive premium report revenue.
          </p>
        </div>
        <span className="eyebrow">Configured onchain</span>
      </div>

      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-card" key={agent.id}>
            <div className="agent-card__header">
              <span className="badge">{agent.role}</span>
              <span className="score">{agent.payoutLabel}</span>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.specialty}</p>
            <dl>
              <div>
                <dt>Wallet</dt>
                <dd>
                  <a href={agent.walletExplorerUrl} rel="noreferrer" target="_blank">
                    Open explorer
                  </a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{agent.walletAddress}</dd>
              </div>
              <div>
                <dt>Validation tag</dt>
                <dd>{agent.validationLabel}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
