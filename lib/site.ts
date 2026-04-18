export const siteConfig = {
  name: "Arc Agent Research Marketplace",
  description:
    "A live Arc-native research marketplace that launches specialist jobs, shows transaction proof, and monetizes premium reports through x402.",
  githubUrl: "https://github.com/Bela1401/arc-agent-research-marketplace",
  productionUrl: "https://arc-agent-research-marketplace.vercel.app"
} as const;

export const homeNavItems = [
  { href: "#overview", label: "Overview" },
  { href: "#live-feed", label: "Live Feed" },
  { href: "#launcher", label: "Launcher" },
  { href: "#premium", label: "Premium" },
  { href: "#network", label: "Network" }
] as const;

export const launchPresets = [
  {
    role: "research",
    title: "Market Scan",
    description:
      "Analyze the top AI agent payment competitors and summarize the gap for Arc-native micropayments."
  },
  {
    role: "factCheck",
    title: "Evidence Review",
    description:
      "Verify the public claims and evidence behind the strongest competitor narratives."
  },
  {
    role: "summary",
    title: "Executive Brief",
    description:
      "Produce a concise executive brief with the strongest opportunities for Arc-native agent payments."
  }
] as const;

export function buildLaunchHref(role: string, description: string) {
  return `/launch?providerRole=${encodeURIComponent(role)}&description=${encodeURIComponent(description)}`;
}

export const judgeNavItems = [
  { href: "#overview", label: "Overview" },
  { href: "#script", label: "Autopilot" },
  { href: "#resources", label: "Resources" }
] as const;

export const submissionNavItems = [
  { href: "#overview", label: "Overview" },
  { href: "#copy", label: "Copy Pack" },
  { href: "#video", label: "Video" },
  { href: "#checklist", label: "Checklist" }
] as const;

export const judgeDemoSteps = [
  {
    id: "step-home",
    title: "Open the live dashboard",
    timing: "0:00 - 0:20",
    outcome: "Show the live Arc dashboard with recent jobs, explorer links, and the current premium report rail.",
    buttonLabel: "Open homepage",
    href: "/"
  },
  {
    id: "step-run",
    title: "Run a fresh Arc job",
    timing: "0:20 - 0:55",
    outcome: "Trigger a real specialist job directly from the browser so the audience sees new Arc activity, not a mock replay.",
    buttonLabel: "Run research job",
    role: "research",
    description:
      "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments."
  },
  {
    id: "step-refresh",
    title: "Watch it land in the feed",
    timing: "0:55 - 1:10",
    outcome: "Return to the homepage and show the newly created run surfacing in the live feed with transaction trail links.",
    buttonLabel: "Jump to recent runs",
    href: "/#recent"
  },
  {
    id: "step-premium",
    title: "Open the premium layer",
    timing: "1:10 - 1:30",
    outcome: "Show that research output becomes monetizable inventory through a real x402 premium unlock instead of staying a dead demo artifact.",
    buttonLabel: "Open premium paywall",
    href: "/api/reports/premium"
  },
  {
    id: "step-proof",
    title: "Open proof rails",
    timing: "1:30 - 1:45",
    outcome: "If judges want technical depth, jump straight to API status, wallets, or GitHub without breaking the flow.",
    buttonLabel: "Open API status",
    href: "/api/arc/status"
  }
] as const;
