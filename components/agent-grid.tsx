import type { AgentProfile } from "@/lib/types";
import { usd } from "@/lib/format";

interface AgentGridProps {
  agents: AgentProfile[];
}

export function AgentGrid({ agents }: AgentGridProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Agent identities</h2>
        <p>ERC-8004 style profiles with role-specific pricing and reputation.</p>
      </div>

      <div className="agent-grid">
        {agents.map((agent) => (
          <article className="agent-card" key={agent.id}>
            <div className="agent-card__header">
              <span className="badge">{agent.role.replace("_", " ")}</span>
              <span className="score">{agent.reputationScore}/100</span>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.specialty}</p>
            <dl>
              <div>
                <dt>Identity</dt>
                <dd>{agent.identityId}</dd>
              </div>
              <div>
                <dt>Wallet</dt>
                <dd>{agent.walletAddress}</dd>
              </div>
              <div>
                <dt>Task price</dt>
                <dd>{usd(agent.pricePerTaskUsd)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
