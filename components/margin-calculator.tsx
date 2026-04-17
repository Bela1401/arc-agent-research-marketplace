"use client";

import { useMemo, useState } from "react";
import { usd } from "@/lib/format";
import type { MarginCalculatorSeed } from "@/lib/live-marketplace";

interface MarginCalculatorProps {
  seed: MarginCalculatorSeed;
}

function roundTo(value: number, digits: number) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

export function MarginCalculator({ seed }: MarginCalculatorProps) {
  const [specialistLegs, setSpecialistLegs] = useState(seed.defaultLegs);
  const [arcLegCost, setArcLegCost] = useState(seed.averageArcLegUsd);
  const [unlockPrice, setUnlockPrice] = useState(seed.defaultUnlockPriceUsd);
  const [expectedUnlocks, setExpectedUnlocks] = useState(seed.defaultExpectedUnlocks);
  const [traditionalGas, setTraditionalGas] = useState(seed.defaultTraditionalGasUsd);

  const metrics = useMemo(() => {
    const arcCreationCost = specialistLegs * arcLegCost;
    const arcRevenue = expectedUnlocks * unlockPrice;
    const arcMargin = arcRevenue - arcCreationCost;
    const traditionalTotalCost = arcCreationCost + expectedUnlocks * traditionalGas;
    const traditionalMargin = arcRevenue - traditionalTotalCost;
    const arcBreakEvenUnlocks = Math.ceil(arcCreationCost / unlockPrice);
    const traditionalBreakEvenUnlocks = Math.ceil(traditionalTotalCost / unlockPrice);
    const efficiencyMultiple = traditionalTotalCost / Math.max(arcCreationCost, 0.0001);

    let whyItBreaksElsewhere =
      "Traditional rails still work for larger tickets, but they pressure teams to bundle work instead of paying per specialist step.";

    if (traditionalGas > unlockPrice) {
      whyItBreaksElsewhere =
        "The estimated gas overhead per unlock is higher than the unlock revenue itself, so sub-cent resale stops making sense.";
    } else if (traditionalMargin < 0) {
      whyItBreaksElsewhere =
        "The unlock can still execute elsewhere, but the payment overhead wipes out the resale margin much faster than on Arc.";
    }

    return {
      arcCreationCost,
      arcRevenue,
      arcMargin,
      traditionalTotalCost,
      traditionalMargin,
      arcBreakEvenUnlocks,
      traditionalBreakEvenUnlocks,
      efficiencyMultiple,
      whyItBreaksElsewhere
    };
  }, [arcLegCost, expectedUnlocks, specialistLegs, traditionalGas, unlockPrice]);

  return (
    <section className="panel" id="margin">
      <div className="section-heading">
        <div>
          <h2>Margin calculator</h2>
          <p>
            This block turns the story into numbers: generate a report once, resell premium access,
            and compare Arc-native economics against a higher-friction gas path.
          </p>
        </div>
        <span className="eyebrow">Interactive model</span>
      </div>

      <div className="calculator-layout">
        <div className="calculator-controls">
          <label className="calculator-field">
            <span>Specialist legs per report: {specialistLegs}</span>
            <input
              max={8}
              min={2}
              onChange={(event) => setSpecialistLegs(Number(event.target.value))}
              type="range"
              value={specialistLegs}
            />
          </label>

          <label className="calculator-field">
            <span>Arc cost per specialist leg: {usd(roundTo(arcLegCost, 3))}</span>
            <input
              max={0.02}
              min={0.002}
              onChange={(event) => setArcLegCost(Number(event.target.value))}
              step={0.001}
              type="range"
              value={arcLegCost}
            />
          </label>

          <label className="calculator-field">
            <span>Premium unlock price: {usd(roundTo(unlockPrice, 3))}</span>
            <input
              max={0.02}
              min={0.002}
              onChange={(event) => setUnlockPrice(Number(event.target.value))}
              step={0.001}
              type="range"
              value={unlockPrice}
            />
          </label>

          <label className="calculator-field">
            <span>Expected paid unlocks: {expectedUnlocks}</span>
            <input
              max={30}
              min={1}
              onChange={(event) => setExpectedUnlocks(Number(event.target.value))}
              type="range"
              value={expectedUnlocks}
            />
          </label>

          <label className="calculator-field">
            <span>Estimated traditional gas per unlock: {usd(roundTo(traditionalGas, 2))}</span>
            <input
              max={1.5}
              min={0.05}
              onChange={(event) => setTraditionalGas(Number(event.target.value))}
              step={0.05}
              type="range"
              value={traditionalGas}
            />
          </label>
        </div>

        <div className="calculator-results">
          <div className="calculator-output-grid">
            <article className="premium-card">
              <span>Arc report cost</span>
              <strong>{usd(metrics.arcCreationCost)}</strong>
              <p>{specialistLegs} paid specialist legs at Arc-native pricing.</p>
            </article>

            <article className="premium-card">
              <span>Revenue from unlocks</span>
              <strong>{usd(metrics.arcRevenue)}</strong>
              <p>
                {expectedUnlocks} unlocks at {usd(unlockPrice)} each.
              </p>
            </article>

            <article className="premium-card">
              <span>Arc margin</span>
              <strong>{usd(metrics.arcMargin)}</strong>
              <p>Break-even happens after about {metrics.arcBreakEvenUnlocks} premium unlocks.</p>
            </article>

            <article className="premium-card">
              <span>Traditional alternative</span>
              <strong>{usd(metrics.traditionalTotalCost)}</strong>
              <p>{roundTo(metrics.efficiencyMultiple, 1)}x heavier than the Arc creation path in this model.</p>
            </article>
          </div>

          <div className="project-brief">
            <div>
              <span className="eyebrow">Why Arc works</span>
              <p>
                Arc keeps the creation cost low enough that report resale can become a clean
                micropayment business instead of collapsing into subscriptions or flat retainers.
              </p>
            </div>
            <div>
              <span className="eyebrow">Why it breaks elsewhere</span>
              <p>{metrics.whyItBreaksElsewhere}</p>
              <p>Traditional break-even moves to roughly {metrics.traditionalBreakEvenUnlocks} paid unlocks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
