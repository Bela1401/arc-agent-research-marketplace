import { AgentGrid } from "@/components/agent-grid";
import { CommandCenter } from "@/components/command-center";
import { EconomicsPanel } from "@/components/economics-panel";
import { Hero } from "@/components/hero";
import { IntegrationReadiness } from "@/components/integration-readiness";
import { LiveProofPanel } from "@/components/live-proof";
import { MarketplaceFlow } from "@/components/marketplace-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TaskBoard } from "@/components/task-board";
import { TxFeed } from "@/components/tx-feed";
import { getDashboardSnapshot } from "@/lib/mock-data";

export default function HomePage() {
  const snapshot = getDashboardSnapshot();

  return (
    <main className="page-shell">
      <SiteHeader />
      <Hero />
      <CommandCenter />
      <MarketplaceFlow />

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

      <div id="proof">
        <LiveProofPanel />
      </div>
      <div className="split-layout">
        <EconomicsPanel economics={snapshot.economics} />
        <IntegrationReadiness />
      </div>
      <AgentGrid agents={snapshot.agents} />
      <TaskBoard tasks={snapshot.project.tasks} agents={snapshot.agents} />
      <TxFeed transactions={snapshot.project.transactions} />
      <SiteFooter />
    </main>
  );
}
