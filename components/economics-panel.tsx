import type { EconomicsSummary } from "@/lib/types";
import { usd } from "@/lib/format";

interface EconomicsPanelProps {
  economics: EconomicsSummary;
}

export function EconomicsPanel({ economics }: EconomicsPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Unit economics</h2>
        <p>This is the panel judges should understand in under 10 seconds.</p>
      </div>

      <div className="economics-grid">
        <article>
          <span>Total tasks</span>
          <strong>{economics.totalTasks}</strong>
        </article>
        <article>
          <span>Total tx</span>
          <strong>{economics.totalTransactions}</strong>
        </article>
        <article>
          <span>Total spend</span>
          <strong>{usd(economics.totalUsdSpent)}</strong>
        </article>
        <article>
          <span>Avg task price</span>
          <strong>{usd(economics.averageTaskPriceUsd)}</strong>
        </article>
        <article>
          <span>Avg spend per tx</span>
          <strong>{usd(economics.averageTransactionCostUsd)}</strong>
        </article>
      </div>
    </section>
  );
}
