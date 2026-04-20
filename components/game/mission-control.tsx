"use client";

import { useState } from "react";
import { buildExplorerUrl } from "@/lib/arc";
import { shortHash } from "@/lib/format";
import { missionPresets } from "@/lib/site";

interface MissionControlProps {
  onMissionCleared: (jobId: string) => Promise<void> | void;
}

interface MissionLaunchResult {
  jobId: string;
  status: string;
  budgetUsd: string;
  deliverableHash: string;
  txHashes: Record<string, string>;
}

const initialPreset = missionPresets[0];
type MissionRole = (typeof missionPresets)[number]["role"];

export function MissionControl({ onMissionCleared }: MissionControlProps) {
  const [token, setToken] = useState("");
  const [selectedRole, setSelectedRole] = useState<MissionRole>(initialPreset.role);
  const [description, setDescription] = useState<string>(initialPreset.description);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MissionLaunchResult | null>(null);

  function selectPreset(role: MissionRole) {
    const preset = missionPresets.find((item) => item.role === role);

    if (!preset) {
      return;
    }

    setSelectedRole(preset.role);
    setDescription(preset.description);
    setError(null);
  }

  async function handleDeploy() {
    if (!token.trim()) {
      setError("Paste ARC_ADMIN_API_TOKEN first so the mission can launch live on Arc.");
      return;
    }

    try {
      setIsRunning(true);
      setError(null);

      const response = await fetch("/api/arc/run-job", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-arc-admin-token": token.trim()
        },
        body: JSON.stringify({
          providerRole: selectedRole,
          description
        })
      });

      const payload = (await response.json().catch(() => null)) as
        | MissionLaunchResult
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload && "error" in payload && payload.error ? payload.error : "Mission launch failed."
        );
      }

      const missionResult = payload as MissionLaunchResult;
      setResult(missionResult);
      await onMissionCleared(missionResult.jobId);

      window.setTimeout(() => {
        document.getElementById("replay")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 180);
    } catch (launchError) {
      setError(launchError instanceof Error ? launchError.message : "Unknown mission error.");
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <section className="game-panel" id="missions">
      <div className="panel-header">
        <div>
          <span className="eyebrow">Mission Control</span>
          <h2>Deploy a live Arc mission</h2>
          <p>
            Pick a mission class, paste the admin token, and clear one real Arc run without leaving
            the game board.
          </p>
        </div>
        <div className="hero-pills">
          <span>Browser-triggered</span>
          <span>Real USDC flow</span>
          <span>Explorer replay</span>
        </div>
      </div>

      <div className="mission-grid">
        {missionPresets.map((preset) => {
          const selected = preset.role === selectedRole;

          return (
            <button
              className={`mission-card ${selected ? "mission-card--selected" : ""}`}
              key={preset.role}
              onClick={() => selectPreset(preset.role)}
              type="button"
            >
              <div className="mission-card__top">
                <span className="eyebrow eyebrow--soft">{preset.codename}</span>
                <strong>{preset.difficulty}</strong>
              </div>
              <h3>{preset.title}</h3>
              <p>{preset.description}</p>
              <span className="mission-card__reward">{preset.rewardLabel}</span>
            </button>
          );
        })}
      </div>

      <div className="console-grid">
        <div className="console-card">
          <label className="control-field">
            <span>ARC_ADMIN_API_TOKEN</span>
            <input
              autoComplete="off"
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste the token to enable live deployment"
              type="password"
              value={token}
            />
          </label>

          <label className="control-field">
            <span>Mission role</span>
            <select onChange={(event) => selectPreset(event.target.value as typeof selectedRole)} value={selectedRole}>
              {missionPresets.map((preset) => (
                <option key={preset.role} value={preset.role}>
                  {preset.role}
                </option>
              ))}
            </select>
          </label>

          <label className="control-field control-field--wide">
            <span>Mission brief</span>
            <textarea onChange={(event) => setDescription(event.target.value)} rows={5} value={description} />
          </label>

          <div className="button-row">
            <button className="button button--primary" disabled={isRunning} onClick={handleDeploy} type="button">
              {isRunning ? "Deploying live mission..." : "Deploy mission"}
            </button>
            <a className="button button--ghost" href="/launch">
              Open manual console
            </a>
            <a className="button button--ghost" href="/judges">
              Judge speedrun
            </a>
          </div>

          <p className="helper-copy">
            The token stays in this browser session and is only used to call the live Arc run route.
          </p>
          {error ? <p className="error-copy">{error}</p> : null}
        </div>

        <div className="console-card console-card--result">
          <span className="eyebrow">Mission status</span>
          {result ? (
            <>
              <h3>Mission #{result.jobId} cleared</h3>
              <p>
                The run finished with status <strong>{result.status}</strong> and the replay links are
                ready below.
              </p>

              <div className="result-grid">
                <article className="result-card">
                  <span>Budget</span>
                  <strong>{result.budgetUsd} USDC</strong>
                </article>
                <article className="result-card">
                  <span>Deliverable hash</span>
                  <strong>{shortHash(result.deliverableHash)}</strong>
                </article>
              </div>

              <div className="timeline-list">
                {Object.entries(result.txHashes)
                  .filter(([, hash]) => hash && hash !== "0x")
                  .map(([label, hash]) => (
                    <a
                      className="timeline-node"
                      href={buildExplorerUrl(hash)}
                      key={`${result.jobId}-${label}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span>{label}</span>
                      <strong>{shortHash(hash)}</strong>
                    </a>
                  ))}
              </div>
            </>
          ) : (
            <>
              <h3>Waiting for deployment</h3>
              <p>
                Clear one mission to show the exact Arc lifecycle: create, budget, approve, fund,
                submit, complete.
              </p>
              <div className="result-grid">
                <article className="result-card">
                  <span>Fastest demo loop</span>
                  <strong>Sector Sweep</strong>
                </article>
                <article className="result-card">
                  <span>Why it matters</span>
                  <strong>Real tx proof stays inside the product</strong>
                </article>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
