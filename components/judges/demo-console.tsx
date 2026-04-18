"use client";

import { useMemo, useState } from "react";
import { buildLaunchHref, judgeDemoSteps } from "@/lib/site";

function buildRunJobHref(role: string, description: string, token: string) {
  if (!token.trim()) {
    return buildLaunchHref(role, description);
  }

  return `/api/arc/run-job?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(
    description
  )}&token=${encodeURIComponent(token)}&format=html`;
}

export function DemoConsole() {
  const [token, setToken] = useState("");
  const [pitchMode, setPitchMode] = useState<"fast" | "full">("fast");
  const [autopilotState, setAutopilotState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Paste ARC_ADMIN_API_TOKEN to make the live run step one-click from this page."
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
      setMessage("Paste ARC_ADMIN_API_TOKEN first so this page can launch the live job automatically.");
      return;
    }

    try {
      setAutopilotState("running");
      setMessage("Submitting a live research job to Arc. Stay on this page for a few seconds.");

      const runStep = judgeDemoSteps.find((step) => step.id === "step-run");

      if (!runStep || !("role" in runStep)) {
        throw new Error("The live run step is not configured correctly.");
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
        throw new Error(payload?.error ?? "Live Arc job failed.");
      }

      const jobId = payload?.jobId;

      if (!jobId) {
        throw new Error("Arc job completed, but the response did not include a job id.");
      }

      setAutopilotState("success");
      setMessage(`Live job #${jobId} completed. Redirecting to the refreshed dashboard now.`);

      window.setTimeout(() => {
        window.location.assign(`/?focusJob=${encodeURIComponent(jobId)}#live-feed`);
      }, 1200);
    } catch (error) {
      setAutopilotState("error");
      setMessage(error instanceof Error ? error.message : "Unknown autopilot error.");
    }
  }

  return (
    <section className="surface" id="script">
      <div className="section-head">
        <div>
          <span className="pill">Autopilot Demo</span>
          <h2>One page for the whole presentation flow</h2>
          <p>
            Keep the pitch clean: start from the dashboard, run a new job, return to the live feed,
            and end on the premium unlock.
          </p>
        </div>

        <div className="toggle-row">
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

      <div className="demo-toolbar">
        <label className="field field--wide">
          <span>ARC_ADMIN_API_TOKEN</span>
          <input
            autoComplete="off"
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste the admin token to enable one-click live runs"
            type="password"
            value={token}
          />
        </label>

        <div className="callout">
          <span className="pill pill--soft">Autopilot status</span>
          <p>{message}</p>
          <div className="link-row">
            <button
              className="button button--primary"
              disabled={autopilotState === "running"}
              onClick={handleAutopilot}
              type="button"
            >
              {autopilotState === "running" ? "Running live job..." : "Run autopilot"}
            </button>
            <a className="button button--ghost" href="/">
              Open dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="step-grid">
        {visibleSteps.map((step, index) => {
          const href = "role" in step ? buildRunJobHref(step.role, step.description, token) : step.href;
          const helperText =
            "role" in step
              ? token.trim()
                ? "Token detected. This button now launches a real Arc job directly."
                : "No token yet. This opens the launcher with the prompt prefilled."
              : step.outcome;

          return (
            <article className="step-card" key={step.id}>
              <div className="step-card__top">
                <span className="pill pill--soft">Step {index + 1}</span>
                <strong>{step.timing}</strong>
              </div>
              <h3>{step.title}</h3>
              <p>{step.outcome}</p>
              <div className="hint-box">{helperText}</div>
              <div className="link-row">
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
