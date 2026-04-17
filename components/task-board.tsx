import type { AgentProfile, MicroTask } from "@/lib/types";
import { usd } from "@/lib/format";

interface TaskBoardProps {
  tasks: MicroTask[];
  agents: AgentProfile[];
}

function agentName(agentId: string, agents: AgentProfile[]): string {
  return agents.find((agent) => agent.id === agentId)?.name ?? "Unassigned";
}

export function TaskBoard({ tasks, agents }: TaskBoardProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Microtask board</h2>
        <p>The product story stays simple: break work apart, route it to specialists, and settle each step independently.</p>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article className="task-card" key={task.id}>
            <div className="task-card__meta">
              <span className={`status status--${task.status}`}>{task.status}</span>
              <span>{usd(task.priceUsd)}</span>
            </div>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <dl>
              <div>
                <dt>Assigned agent</dt>
                <dd>{agentName(task.assignedAgentId, agents)}</dd>
              </div>
              <div>
                <dt>Deliverable</dt>
                <dd>{task.evidenceHash ?? "Pending"}</dd>
              </div>
            </dl>
            <p className="task-card__result">{task.resultPreview}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
