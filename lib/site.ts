export const siteConfig = {
  name: "Arc Ops",
  description:
    "A playable Arc mission-control experience where every cleared mission maps to a real Arc job, visible tx proof, and a premium intel vault.",
  githubUrl: "https://github.com/Bela1401/arc-agent-research-marketplace",
  productionUrl: "https://arc-agent-research-marketplace.vercel.app"
} as const;

export const homeNavItems = [
  { href: "#arena", label: "Arena" },
  { href: "#missions", label: "Missions" },
  { href: "#replay", label: "Replay" },
  { href: "#vault", label: "Vault" },
  { href: "#ops", label: "Ops" }
] as const;

export const missionPresets = [
  {
    role: "research",
    codename: "Sector Sweep",
    title: "Scout the market",
    difficulty: "Easy",
    rewardLabel: "Unlocks competitor map",
    description:
      "Analyze the top AI agent payment competitors and surface the biggest gap for Arc-native micropayments."
  },
  {
    role: "factCheck",
    codename: "Truth Firewall",
    title: "Verify the signal",
    difficulty: "Medium",
    rewardLabel: "Adds proof score",
    description:
      "Verify the strongest public claims and evidence behind the leading AI agent payment competitors."
  },
  {
    role: "summary",
    codename: "Final Broadcast",
    title: "Forge the brief",
    difficulty: "Hard",
    rewardLabel: "Feeds premium vault",
    description:
      "Produce a concise executive brief showing where Arc-native micropayments outperform existing alternatives."
  }
] as const;

export function buildLaunchHref(role: string, description: string) {
  return `/launch?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(description)}`;
}

export const judgeNavItems = [
  { href: "#speedrun", label: "Speedrun" },
  { href: "#proof", label: "Proof" },
  { href: "#assets", label: "Assets" }
] as const;

export const submissionNavItems = [
  { href: "#overview", label: "Overview" },
  { href: "#copy", label: "Copy" },
  { href: "#video", label: "Video" },
  { href: "#checklist", label: "Checklist" }
] as const;

export const judgeDemoSteps = [
  {
    id: "step-home",
    title: "Open Arc Ops",
    timing: "0:00 - 0:15",
    outcome:
      "Start on the playable homepage so judges immediately see that this is a live product surface, not a static presentation.",
    buttonLabel: "Open game",
    href: "/"
  },
  {
    id: "step-run",
    title: "Clear one live mission",
    timing: "0:15 - 0:45",
    outcome:
      "Use one-click autopilot to launch a real Arc job from the browser and let the mission completion screen prove the tx flow.",
    buttonLabel: "Run Sector Sweep",
    role: "research",
    description:
      "Analyze the top AI agent payment competitors and surface the biggest gap for Arc-native micropayments."
  },
  {
    id: "step-replay",
    title: "Show the replay log",
    timing: "0:45 - 1:00",
    outcome:
      "Return to the mission replay board and show the new job entering the live feed with lifecycle links and timestamps.",
    buttonLabel: "Open replay board",
    href: "/#replay"
  },
  {
    id: "step-vault",
    title: "Open the Intel Vault",
    timing: "1:00 - 1:15",
    outcome:
      "Show that the completed output can be resold through an x402 premium unlock instead of ending as a one-off demo artifact.",
    buttonLabel: "Open vault",
    href: "/api/reports/premium"
  },
  {
    id: "step-proof",
    title: "Open proof rails",
    timing: "1:15 - 1:30",
    outcome:
      "If judges ask for technical depth, jump to API status, GitHub, Circle console context, and Arc explorer links without breaking the story.",
    buttonLabel: "Open API status",
    href: "/api/arc/status"
  }
] as const;
