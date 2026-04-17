"use client";

import { useMemo, useState } from "react";
import { judgeDemoSteps } from "@/lib/site";

function buildRunJobHref(role: string, description: string, token: string) {
  if (!token.trim()) {
    return `/launch?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(description)}`;
  }

  return `/api/arc/run-job?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(
    description
  )}&token=${encodeURIComponent(token)}&format=html`;
}

export function JudgeDemoPanel() {
  const [token, setToken] = useState("");
  const [pitchMode, setPitchMode] = useState<"fast" | "full">("fast");

  const visibleSteps = useMemo(() => {
    if (pitchMode === "fast") {
      return judgeDemoSteps.filter((step) =>
        ["step-home", "step-run", "step-refresh", "step-premium"].includes(step.id)
      );
    }

    return judgeDemoSteps;
  }, [pitchMode]);

  return (
    <section className="panel panel--highlight" id="script">
      <div className="section-heading">
        <div>
          <h2>One-click demo script</h2>
          <p>
            This page is built for the live pitch. Open each step in order and the whole Arc story
            walks itself: proof, fresh job, feed update, and monetized report unlock.
          </p>
        </div>
        <span className="eyebrow">Judge mode</span>
      </div>

      <div className="judge-toolbar">
        <label className="browser-launch-field">
          <span>Admin token for one-click live runs</span>
          <input
            autoComplete="off"
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste ARC_ADMIN_API_TOKEN to make the live run step one-click"
            type="password"
            value={token}
          />
        </label>

        <div className="judge-toggle">
          <button
            className={`button ${pitchMode === "fast" ? "button--primary" : "button--ghost"}`}
            onClick={() => setPitchMode("fast")}
            type="button"
          >
            90s pitch
          </button>
          <button
            className={`button ${pitchMode === "full" ? "button--primary" : "button--ghost"}`}
            onClick={() => setPitchMode("full")}
            type="button"
          >
            Full walkthrough
          </button>
        </div>
      </div>

      <div className="judge-script-grid">
        {visibleSteps.map((step, index) => {
          const href =
            "role" in step
              ? buildRunJobHref(step.role, step.description, token)
              : step.href;

          const helperText =
            "role" in step
              ? token.trim()
                ? "Token detected: this button now launches a real job directly."
                : "No token yet: this button opens the launcher with the prompt prefilled."
              : step.outcome;

          return (
            <article className="judge-step-card" key={step.id}>
              <div className="judge-step-card__top">
                <span className="eyebrow">Step {index + 1}</span>
                <strong>{step.timing}</strong>
              </div>
              <h3>{step.title}</h3>
              <p>{step.outcome}</p>
              <div className="judge-step-card__helper">{helperText}</div>
              <div className="judge-step-card__actions">
                <a
                  className="button button--primary"
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {step.buttonLabel}
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
