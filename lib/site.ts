export const siteConfig = {
  name: "Arc Agent Research Marketplace",
  description:
    "A polished agentic commerce demo that pays specialist AI agents in USDC on Arc and monetizes premium reports with x402.",
  githubUrl: "https://github.com/Bela1401/arc-agent-research-marketplace",
  productionUrl: "https://arc-agent-research-marketplace.vercel.app"
} as const;

export const launchPresets = [
  {
    role: "research",
    title: "Run Research Job",
    description:
      "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments."
  },
  {
    role: "factCheck",
    title: "Run Fact-Check Job",
    description:
      "Verify the public claims and evidence for researched competitors and flag unsupported statements."
  },
  {
    role: "summary",
    title: "Run Summary Job",
    description:
      "Create a concise executive summary of the market gaps and opportunities in Arc-native micropayments."
  }
] as const;

export const judgeNavItems = [
  { href: "#script", label: "Demo Script" },
  { href: "#flow", label: "Live Flow" },
  { href: "#fallback", label: "Fallbacks" },
  { href: "#assets", label: "Assets" }
] as const;

export const submissionNavItems = [
  { href: "#overview", label: "Overview" },
  { href: "#copy", label: "Copy Pack" },
  { href: "#video", label: "Video Flow" },
  { href: "#checklist", label: "Checklist" }
] as const;

export const judgeDemoSteps = [
  {
    id: "step-home",
    title: "Open the homepage",
    timing: "0:00 - 0:20",
    outcome: "Show that recent runs, Arc proofs, and premium monetization already exist on one surface.",
    buttonLabel: "Open homepage",
    href: "/"
  },
  {
    id: "step-teaser",
    title: "Open the free teaser",
    timing: "0:20 - 0:35",
    outcome: "Show that the product ships public preview data before the paid unlock.",
    buttonLabel: "Open teaser JSON",
    href: "/api/reports/teaser"
  },
  {
    id: "step-run",
    title: "Run a fresh live Arc job",
    timing: "0:35 - 1:20",
    outcome: "Generate a new specialist job from the browser and let the result page prove the lifecycle.",
    buttonLabel: "Run research job",
    role: "research",
    description:
      "Analyze the top AI agent payment competitors and summarize gaps for Arc-native micropayments."
  },
  {
    id: "step-refresh",
    title: "Return to recent runs",
    timing: "1:20 - 1:35",
    outcome: "Refresh the homepage and show that the new job now appears in the live Arc feed.",
    buttonLabel: "Jump to recent runs",
    href: "/#recent"
  },
  {
    id: "step-premium",
    title: "Open the premium paywall",
    timing: "1:35 - 1:55",
    outcome: "Show that reports can be resold per unlock through x402 instead of staying a one-off demo artifact.",
    buttonLabel: "Open premium paywall",
    href: "/api/reports/premium"
  },
  {
    id: "step-proof",
    title: "Open technical proof",
    timing: "1:55 - 2:10",
    outcome: "If judges want depth, jump straight to API status, GitHub, or the launcher without leaving the flow.",
    buttonLabel: "Open API status",
    href: "/api/arc/status"
  }
] as const;
