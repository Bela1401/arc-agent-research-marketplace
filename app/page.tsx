import { AgentGrid } from "@/components/agent-grid";
import { EconomicsPanel } from "@/components/economics-panel";
import { Hero } from "@/components/hero";
import { IntegrationReadiness } from "@/components/integration-readiness";
import { LiveProofPanel } from "@/components/live-proof";
import { TaskBoard } from "@/components/task-board";
import { TxFeed } from "@/components/tx-feed";
import { getDashboardSnapshot } from "@/lib/mock-data";

export default function HomePage() {
  const snapshot = getDashboardSnapshot();

  return (
    <main className="page-shell">
      <Hero />

      <section className="panel panel--highlight">
        <div className="section-heading">
          <h2>Research brief</h2>
          <p>The manager agent turns a single user prompt into paid specialist work.</p>
        </div>
        <div className="project-brief">
          <div>
            <span className="eyebrow">Project</span>
            <h3>{snapshot.project.title}</h3>
            <p>{snapshot.project.brief}</p>
          </div>
          <div>
            <span className="eyebrow">Final report</span>
            <p>{snapshot.project.finalReport}</p>
          </div>
        </div>
      </section>

      <EconomicsPanel economics={snapshot.economics} />
      <LiveProofPanel />
      <section className="panel">
        <div className="section-heading">
          <h2>Browser control</h2>
          <p>
            Need a fast live rerun during the demo? Use the browser launcher to create a new Arc
            job directly from a URL.
          </p>
        </div>
        <div className="project-brief">
          <div>
            <span className="eyebrow">Launcher page</span>
            <h3>/launch</h3>
            <p>
              Open the browser launcher, paste the admin token, choose a provider role, and start
              a new job in one click.
            </p>
          </div>
          <div>
            <span className="eyebrow">Direct trigger</span>
            <p>
              You can also open a direct URL like `/api/arc/run-job?providerRole=research&amp;token=...&amp;format=html`
              from the browser for a one-link demo.
            </p>
          </div>
        </div>
      </section>
      <IntegrationReadiness />
      <AgentGrid agents={snapshot.agents} />
      <TaskBoard tasks={snapshot.project.tasks} agents={snapshot.agents} />
      <TxFeed transactions={snapshot.project.transactions} />
    </main>
  );
}
