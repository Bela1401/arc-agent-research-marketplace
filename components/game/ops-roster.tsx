import { ARC_CONTRACTS, arcTestnet, hackathonTargets } from "@/lib/arc";
import { shortHash, usd } from "@/lib/format";
import type { AgentRegistryEntry } from "@/lib/live-marketplace";

interface OpsRosterProps {
  agents: AgentRegistryEntry[];
}

export function OpsRoster({ agents }: OpsRosterProps) {
  return (
    <section className="game-panel" id="ops">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Ops Deck</span>
          <h2>Network and crew</h2>
          <p>
            This is the technical proof layer for judges: the network, the core contract, and the
            agent wallets behind the playable missions.
          </p>
        </div>
      </div>

      <div className="score-grid">
        <article className="score-card">
          <span>Network</span>
          <strong>{arcTestnet.name}</strong>
        </article>
        <article className="score-card">
          <span>Settlement contract</span>
          <strong>{shortHash(ARC_CONTRACTS.agenticCommerce)}</strong>
        </article>
        <article className="score-card">
          <span>Price target</span>
          <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
        </article>
      </div>

      <div className="crew-grid">
        {agents.map((agent) => (
          <article className="crew-card" key={agent.id}>
            <div className="crew-card__top">
              <span className="eyebrow eyebrow--soft">{agent.role}</span>
              <a href={agent.walletExplorerUrl} rel="noreferrer" target="_blank">
                {shortHash(agent.walletAddress)}
              </a>
            </div>
            <h3>{agent.name}</h3>
            <p>{agent.specialty}</p>
            <div className="crew-tags">
              <span>{agent.payoutLabel}</span>
              <span>{agent.validationLabel}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="proof-note">
        <p>
          For the hackathon video, pair this section with one Arc explorer link from the replay
          board and one Circle Console transaction view.
        </p>
      </div>
    </section>
  );
}
