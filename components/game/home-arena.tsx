"use client";

import { startTransition, useEffect, useState } from "react";
import { hackathonTargets } from "@/lib/arc";
import { usd } from "@/lib/format";
import type { ProjectSnapshot } from "@/lib/live-marketplace";
import { siteConfig } from "@/lib/site";
import { IntelVault } from "@/components/game/intel-vault";
import { MissionControl } from "@/components/game/mission-control";
import { MissionReplay } from "@/components/game/mission-replay";
import { OpsRoster } from "@/components/game/ops-roster";

interface HomeArenaProps {
  initialSnapshot: ProjectSnapshot;
  focusJobId?: string;
}

function formatSyncLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

export function HomeArena({ initialSnapshot, focusJobId }: HomeArenaProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [focusedMissionId, setFocusedMissionId] = useState(focusJobId);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState(() => formatSyncLabel(new Date()));

  async function refreshSnapshot(nextFocusId?: string) {
    try {
      setIsRefreshing(true);
      setRefreshError(null);

      const response = await fetch("/api/projects", {
        cache: "no-store",
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Could not refresh the Arc mission board.");
      }

      const payload = (await response.json()) as ProjectSnapshot;

      startTransition(() => {
        setSnapshot(payload);
        setFocusedMissionId(nextFocusId ?? focusedMissionId);
        setLastUpdatedLabel(formatSyncLabel(new Date()));
      });
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : "Unknown refresh error.");
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshSnapshot();
    }, 15_000);

    return () => window.clearInterval(intervalId);
  }, [focusedMissionId]);

  async function handleMissionCleared(jobId: string) {
    setFocusedMissionId(jobId);
    await refreshSnapshot(jobId);
    window.setTimeout(() => void refreshSnapshot(jobId), 2_500);
  }

  const latestRun = snapshot.recentRuns.runs[0];

  return (
    <div className="arena-stack">
      <section className="hero-board" id="arena">
        <div className="hero-board__content">
          <span className="eyebrow">Playable Hackathon Demo</span>
          <h1>Play the Arc settlement loop.</h1>
          <p className="hero-copy">
            {siteConfig.name} is a clean mission-control game: launch a live Arc mission, watch the
            replay log fill with real transactions, then unlock the premium Intel Vault.
          </p>

          <div className="button-row">
            <a className="button button--primary" href="#missions">
              Start mission
            </a>
            <a className="button button--ghost" href="#replay">
              Watch replay
            </a>
            <a className="button button--ghost" href="/judges">
              Judge speedrun
            </a>
          </div>

          <div className="hero-pills">
            <span>Real Arc jobs</span>
            <span>USDC settlement</span>
            <span>Explorer proof</span>
            <span>x402 vault unlock</span>
          </div>
        </div>

        <aside className="hero-hud">
          <div className="score-grid">
            <article className="score-card">
              <span>Missions visible</span>
              <strong>{snapshot.recentRuns.metrics.visibleRuns}</strong>
            </article>
            <article className="score-card">
              <span>Replay links</span>
              <strong>{snapshot.recentRuns.metrics.txLinksVisible}</strong>
            </article>
            <article className="score-card">
              <span>Vault key</span>
              <strong>{usd(snapshot.premium.unlockPriceUsd)}</strong>
            </article>
            <article className="score-card">
              <span>Arc target</span>
              <strong>{usd(hackathonTargets.maxPricePerActionUsd)}</strong>
            </article>
          </div>

          <div className="hero-callout">
            <span className="eyebrow eyebrow--soft">Live signal</span>
            <p>
              Latest mission:{" "}
              <strong>{latestRun ? `#${latestRun.jobId} ${latestRun.status}` : "no mission detected"}</strong>
            </p>
            <p>Board sync: {lastUpdatedLabel}</p>
            {refreshError ? <p className="error-copy">{refreshError}</p> : null}
          </div>
        </aside>
      </section>

      <MissionControl onMissionCleared={handleMissionCleared} />
      <MissionReplay
        focusJobId={focusedMissionId}
        isRefreshing={isRefreshing}
        lastUpdatedLabel={lastUpdatedLabel}
        onRefresh={refreshSnapshot}
        summary={snapshot.recentRuns}
      />
      <IntelVault margin={snapshot.margin} premium={snapshot.premium} />
      <OpsRoster agents={snapshot.agents} />
    </div>
  );
}
