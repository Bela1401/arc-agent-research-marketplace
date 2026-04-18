"use client";

import { useMemo, useState } from "react";
import { usd } from "@/lib/format";
import type { MarginCalculatorSeed } from "@/lib/live-marketplace";

interface ArcEconomicsProps {
  seed: MarginCalculatorSeed;
}

function round(value: number, digits = 3) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

export function ArcEconomics({ seed }: ArcEconomicsProps) {
  const [legs, setLegs] = useState(seed.defaultLegs);
  const [arcLegCost, setArcLegCost] = useState(seed.averageArcLegUsd);
  const [unlockPrice, setUnlockPrice] = useState(seed.defaultUnlockPriceUsd);
  const [expectedUnlocks, setExpectedUnlocks] = useState(seed.defaultExpectedUnlocks);
  const [traditionalGas, setTraditionalGas] = useState(seed.defaultTraditionalGasUsd);

  const metrics = useMemo(() => {
    const arcCreationCost = legs * arcLegCost;
    const arcRevenue = expectedUnlocks * unlockPrice;
    const traditionalCost = arcCreationCost + expectedUnlocks * traditionalGas;
    const arcMargin = arcRevenue - arcCreationCost;
    const traditionalMargin = arcRevenue - traditionalCost;
    const breakEvenArc = Math.ceil(arcCreationCost / Math.max(unlockPrice, 0.0001));
    const breakEvenTraditional = Math.ceil(traditionalCost / Math.max(unlockPrice, 0.0001));

    let narrative =
      "Arc keeps the payment rail light enough that specialist jobs can stay separate instead of being bundled into a subscription.";

    if (traditionalGas > unlockPrice) {
      narrative =
        "The alternative payment rail costs more per unlock than the unlock itself, so pay-per-report stops making economic sense.";
    } else if (traditionalMargin < 0) {
      narrative =
        "The report can still be sold elsewhere, but gas drag wipes out the resale margin much faster than on Arc.";
    }

    return {
      arcCreationCost,
      arcRevenue,
      traditionalCost,
      arcMargin,
      traditionalMargin,
      breakEvenArc,
      breakEvenTraditional,
      narrative
    };
  }, [arcLegCost, expectedUnlocks, legs, traditionalGas, unlockPrice]);

  return (
    <section className="surface" id="economics">
      <div className="section-head">
        <div>
          <span className="pill">Economics</span>
          <h2>Margin calculator</h2>
          <p>
            Keep the logic, lose the clutter: this model shows why Arc supports pay-per-step agent
            work and pay-per-report resale more cleanly than heavier rails.
          </p>
        </div>
      </div>

      <div className="economics-layout">
        <div className="form-card">
          <div className="field-grid">
            <label className="field">
              <span>Specialist legs</span>
              <input
                min={2}
                onChange={(event) => setLegs(Number(event.target.value))}
                step={1}
                type="number"
                value={legs}
              />
            </label>

            <label className="field">
              <span>Arc leg cost (USDC)</span>
              <input
                min={0.001}
                onChange={(event) => setArcLegCost(Number(event.target.value))}
                step={0.001}
                type="number"
                value={round(arcLegCost)}
              />
            </label>

            <label className="field">
              <span>Unlock price (USDC)</span>
              <input
                min={0.001}
                onChange={(event) => setUnlockPrice(Number(event.target.value))}
                step={0.001}
                type="number"
                value={round(unlockPrice)}
              />
            </label>

            <label className="field">
              <span>Expected unlocks</span>
              <input
                min={1}
                onChange={(event) => setExpectedUnlocks(Number(event.target.value))}
                step={1}
                type="number"
                value={expectedUnlocks}
              />
            </label>

            <label className="field field--wide">
              <span>Traditional gas overhead per unlock (USDC)</span>
              <input
                min={0.01}
                onChange={(event) => setTraditionalGas(Number(event.target.value))}
                step={0.01}
                type="number"
                value={round(traditionalGas, 2)}
              />
            </label>
          </div>
        </div>

        <div className="metric-grid">
          <article className="metric-card">
            <span>Arc creation cost</span>
            <strong>{usd(metrics.arcCreationCost)}</strong>
          </article>
          <article className="metric-card">
            <span>Premium revenue</span>
            <strong>{usd(metrics.arcRevenue)}</strong>
          </article>
          <article className="metric-card">
            <span>Arc margin</span>
            <strong>{usd(metrics.arcMargin)}</strong>
          </article>
          <article className="metric-card">
            <span>Traditional total cost</span>
            <strong>{usd(metrics.traditionalCost)}</strong>
          </article>
          <article className="metric-card">
            <span>Arc break-even</span>
            <strong>{metrics.breakEvenArc} unlocks</strong>
          </article>
          <article className="metric-card">
            <span>Traditional break-even</span>
            <strong>{metrics.breakEvenTraditional} unlocks</strong>
          </article>
        </div>
      </div>

      <div className="callout">
        <span className="pill pill--soft">Why this matters</span>
        <p>{metrics.narrative}</p>
      </div>
    </section>
  );
}
