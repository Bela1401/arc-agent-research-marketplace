export const siteConfig = {
  name: "Arc Agent Research Marketplace",
  description:
    "A polished agentic commerce demo that pays specialist AI agents in USDC on Arc and monetizes premium reports with x402.",
  githubUrl: "https://github.com/Bela1401/arc-agent-research-marketplace"
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
