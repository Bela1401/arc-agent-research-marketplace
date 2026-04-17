const flowSteps = [
  {
    title: "Manager agent scopes the brief",
    body: "One prompt turns into discrete specialist tasks with visible budgets and accountable roles."
  },
  {
    title: "Providers get paid per specialty",
    body: "Research, fact-check, and summary agents each earn on their own lane instead of acting like hidden internal functions."
  },
  {
    title: "Settlement is proven on Arc",
    body: "ERC-8183 covers the lifecycle from create and budget to submit and complete, with explorer-ready proof."
  },
  {
    title: "Operators can rerun live",
    body: "The browser launcher gives you a crisp on-stage workflow for spinning up fresh jobs in front of judges."
  }
] as const;

export function MarketplaceFlow() {
  return (
    <section className="panel" id="flow">
      <div className="section-heading">
        <h2>How the product works</h2>
        <p>
          This is the product story judges should understand in one pass: scoped work, specialist
          execution, stablecoin settlement, and verifiable proof.
        </p>
      </div>

      <div className="flow-grid">
        {flowSteps.map((step, index) => (
          <article className="flow-card" key={step.title}>
            <span className="flow-card__index">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
