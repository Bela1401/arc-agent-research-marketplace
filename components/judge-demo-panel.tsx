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
  const [autopilotState, setAutopilotState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [autopilotMessage, setAutopilotMessage] = useState(
    "Paste the admin token, then one click can run a live Arc job and send you straight back to the refreshed homepage."
  );

  const visibleSteps = useMemo(() => {
    if (pitchMode === "fast") {
      return judgeDemoSteps.filter((step) =>
        ["step-home", "step-run", "step-refresh", "step-premium"].includes(step.id)
      );
    }

    return judgeDemoSteps;
  }, [pitchMode]);

  async function handleAutopilot() {
    if (!token.trim()) {
      setAutopilotState("error");
      setAutopilotMessage("Paste ARC_ADMIN_API_TOKEN first so the page can run the live job automatically.");
      return;
    }

    try {
      setAutopilotState("running");
      setAutopilotMessage("Submitting a live research job to Arc. Stay on this page for a few seconds.");

      const runStep = judgeDemoSteps.find((step) => step.id === "step-run");

      if (!runStep || !("role" in runStep)) {
        throw new Error("Judge run step is not configured correctly.");
      }

      const response = await fetch("/api/arc/run-job", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-arc-admin-token": token.trim()
        },
        body: JSON.stringify({
          providerRole: runStep.role,
          description: runStep.description
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | { jobId?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Arc job execution failed.");
      }

      const jobId = payload?.jobId;

      if (!jobId) {
        throw new Error("Arc job finished, but the response did not include a job id.");
      }

      setAutopilotState("success");
      setAutopilotMessage(
        `Live job #${jobId} completed. Redirecting to the homepage recent-runs section now.`
      );

      window.setTimeout(() => {
        window.location.assign(`/?focusJob=${encodeURIComponent(jobId)}#recent`);
      }, 1200);
    } catch (error) {
      setAutopilotState("error");
      setAutopilotMessage(error instanceof Error ? error.message : "Unknown autopilot error.");
    }
  }

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

      <div className="judge-autopilot">
        <div>
          <span className="eyebrow">Autopilot</span>
          <h3>Run the live demo with one button</h3>
          <p>{autopilotMessage}</p>
        </div>
        <div className="judge-autopilot__actions">
          <button
            className="button button--primary"
            disabled={autopilotState === "running"}
            onClick={handleAutopilot}
            type="button"
          >
            {autopilotState === "running" ? "Running live job..." : "Autopilot demo"}
          </button>
          <a className="button button--ghost" href="/#recent">
            Open recent runs manually
          </a>
        </div>
      </div>

      <div className="judge-script-grid">
        {visibleSteps.map((step, index) => {
          const href = "role" in step ? buildRunJobHref(step.role, step.description, token) : step.href;

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
                <a className="button button--primary" href={href} rel="noreferrer" target="_blank">
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
