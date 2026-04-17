import { getConfiguredIntegrationStatus } from "@/lib/marketplace-integration";

export function IntegrationReadiness() {
  const status = getConfiguredIntegrationStatus();

  return (
    <section className="panel panel--highlight">
      <div className="section-heading">
        <h2>Real Arc integration</h2>
        <p>Live routes, real wallet config, and browser-friendly controls are all wired into the same demo surface.</p>
      </div>

      <div className="project-brief project-brief--stack" id="stack">
        <div className="stack-card">
          <span className="eyebrow">Configured wallets</span>
          <p>Validator: {status.validatorWalletAddress ?? "missing"}</p>
          <p>Client: {status.clientWalletAddress ?? "missing"}</p>
          <p>Research: {status.researchWalletAddress ?? "missing"}</p>
          <p>Fact-check: {status.factCheckWalletAddress ?? "missing"}</p>
          <p>Summary: {status.summaryWalletAddress ?? "missing"}</p>
        </div>
        <div className="stack-card">
          <span className="eyebrow">Operator shortcuts</span>
          <p>`/launch` opens the browser launcher for live demo runs.</p>
          <p>`/api/arc/status` gives a fast health and config view.</p>
          <p>`/api/arc/run-job?...` supports one-link browser triggers for fresh jobs.</p>
        </div>
        <div className="stack-card">
          <span className="eyebrow">Runbook</span>
          <p>`npm run arc:bootstrap` creates the validator, client, and agent wallets.</p>
          <p>`npm run arc:register-agents` registers and validates the marketplace agents on Arc.</p>
          <p>`npm run arc:run-job research` executes a real ERC-8183 job against the research agent.</p>
        </div>
      </div>
    </section>
  );
}
