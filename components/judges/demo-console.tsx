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
  const [mode, setMode] = useState<"fast" | "full">("fast");
  const [autopilotState, setAutopilotState] = useState<"idle" | "running" | "success" | "error">("idle");
  const [message, setMessage] = useState(
    "Paste ARC_ADMIN_API_TOKEN and this page will run the speedrun for you."
  );

  const visibleSteps = useMemo(() => {
    if (mode === "fast") {
      return judgeDemoSteps.filter((step) =>
        ["step-home", "step-run", "step-replay", "step-vault"].includes(step.id)
      );
    }

    return judgeDemoSteps;
  }, [mode]);

  async function handleAutopilot() {
    if (!token.trim()) {
      setAutopilotState("error");
      setMessage("Paste ARC_ADMIN_API_TOKEN first so the speedrun can launch live.");
      return;
    }

    try {
      setAutopilotState("running");
      setMessage("Launching a live Sector Sweep mission on Arc. Stay here for a moment.");

      const runStep = judgeDemoSteps.find((step) => step.id === "step-run");

      if (!runStep || !("role" in runStep)) {
        throw new Error("The speedrun mission is not configured correctly.");
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
        throw new Error(payload?.error ?? "Arc speedrun failed.");
      }

      const jobId = payload?.jobId;

      if (!jobId) {
        throw new Error("Arc mission completed, but no job id came back.");
      }

      setAutopilotState("success");
      setMessage(`Mission #${jobId} cleared. Redirecting to the replay board now.`);

      window.setTimeout(() => {
        window.location.assign(`/?focusJob=${encodeURIComponent(jobId)}#replay`);
      }, 1300);
    } catch (error) {
      setAutopilotState("error");
      setMessage(error instanceof Error ? error.message : "Unknown speedrun error.");
    }
  }

  return (
    <section className="game-panel" id="speedrun">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Judge Speedrun</span>
          <h2>One-click demo path</h2>
          <p>
            Start the playable Arc loop, clear one live mission, jump to the replay board, then open
            the premium vault.
          </p>
        </div>

        <div className="button-row">
          <button
            className={`button ${mode === "fast" ? "button--primary" : "button--ghost"}`}
            onClick={() => setMode("fast")}
            type="button"
          >
            90-second mode
          </button>
          <button
            className={`button ${mode === "full" ? "button--primary" : "button--ghost"}`}
            onClick={() => setMode("full")}
            type="button"
          >
            Full mode
          </button>
        </div>
      </div>

      <div className="console-grid">
        <div className="console-card">
          <label className="control-field">
            <span>ARC_ADMIN_API_TOKEN</span>
            <input
              autoComplete="off"
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste the token to unlock one-click speedrun mode"
              type="password"
              value={token}
            />
          </label>

          <div className="button-row">
            <button
              className="button button--primary"
              disabled={autopilotState === "running"}
              onClick={handleAutopilot}
              type="button"
            >
              {autopilotState === "running" ? "Running speedrun..." : "Run speedrun"}
            </button>
            <a className="button button--ghost" href="/">
              Open Arc Ops
            </a>
          </div>

          <p className="helper-copy">{message}</p>
        </div>

        <div className="console-card console-card--result">
          <span className="eyebrow eyebrow--soft">Required proof</span>
          <h3>What judges must see</h3>
          <ul className="check-list">
            <li>One live Arc mission launched from the browser</li>
            <li>The mission appearing on the replay board</li>
            <li>One Arc explorer link opened from the tx trail</li>
            <li>Circle Console context shown during the video</li>
            <li>The premium vault endpoint opened at the end</li>
          </ul>
        </div>
      </div>

      <div className="replay-grid replay-grid--steps">
        {visibleSteps.map((step, index) => {
          const href = "role" in step ? buildRunJobHref(step.role, step.description, token) : step.href;

          return (
            <article className="replay-card" key={step.id}>
              <div className="replay-card__head">
                <div>
                  <span className="eyebrow eyebrow--soft">Step {index + 1}</span>
                  <h3>{step.title}</h3>
                </div>
                <strong>{step.timing}</strong>
              </div>
              <div className="replay-card__body">
                <p>{step.outcome}</p>
              </div>
              <div className="button-row">
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
